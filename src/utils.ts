import { DataFrame, Field, FieldType } from '@grafana/data';
import { TRUNCATE_OPTIONS } from 'consts';
import { truncate, unzip } from 'lodash';
import { CorrelationMatrixOptions } from 'models.gen';
import { CorrelationMatrixData } from 'types';

function validateSeries(series: DataFrame[], options: CorrelationMatrixOptions): void {
    let errorMessage = '';
    if (series.length === 0) {
        errorMessage = 'No data';
    } else if (series[options.series].fields.length < 2) {
        errorMessage = 'Data must have at least two columns';
    } else if (series[options.series].fields.length !== series[options.series].fields[0].values.length + 1) {
        errorMessage = 'Matrix must be square';
    } else {
        // Skip first field because it is a column of labels (strings that can be empty/null).
        for (let i = 1; i < series[options.series].fields.length; i++) {
            const field = series[options.series].fields[i];
            if (field.values.toArray().some(value => value === null)) {
                errorMessage = 'Matrix must not have null values';
                break;
            } else if (field.type !== FieldType.number) {
                errorMessage = 'Matrix must be numeric';
                break;
            }
        };
    }

    if (errorMessage) {
        throw new Error(errorMessage);
    }
};

function normalize(value: number, min: number, max: number): number {
    return (value - min) / (max - min) * 2 - 1;
}

function getNormalizedValues(numericFields: Field<any, any[]>[]): number[][] {
    // A field holds the min and max values of the whole series, not the field itself.
    return numericFields.map(field => field.values.map(value =>
        normalize(value, field.state?.range?.min!, field.state?.range?.max!)
    ));
}

function getThresholdedData(labels: string[], normalizedValues: number[][], threshold: number): CorrelationMatrixData {
    const labelsThresholded: string[] = [];
    const zValuesThresholded: number[][] = [];
    // A column is not added to the visualization data if all the values in that column expect one (that is expected to
    // equal one) do not correlate (lower than threshold).
    normalizedValues.forEach((values, colIndex) => {
        let uncorrCount = 1;
        values.forEach(value => {
            if (Math.abs(value) < Math.abs(threshold)) {
                uncorrCount++;
            }
        });
        if (uncorrCount < values.length) {
            labelsThresholded.push(labels[colIndex]);
            zValuesThresholded.push(normalizedValues[colIndex]);
        }
    });

    return { xValues: labelsThresholded, yValues: labelsThresholded, zValues: zValuesThresholded };
}

export function prepareCorrelationMatrixData(
    series: DataFrame[],
    options: CorrelationMatrixOptions
): CorrelationMatrixData {
    validateSeries(series, options);

    const numericFields = series[options.series].fields.slice(1);
    let xValues = numericFields.map(field => truncate(field.name, TRUNCATE_OPTIONS));
    let yValues = xValues;
    let zValues: number[][] = numericFields.map(field => field.values.toArray());
    if (options.normalize || options.threshold) {
        const normalizedValues = getNormalizedValues(numericFields);
        if (options.normalize) {
            zValues = normalizedValues;
        }
        if (options.threshold) {
            ({ xValues, yValues, zValues } = getThresholdedData(xValues, normalizedValues, options.threshold));
        }
    }
    // Plotly expects the z values to be passed as an array of rows. Grafana presents values as an array of columns.
    // Unzip reformats the data from columns to rows.
    zValues = unzip(zValues);

    return { xValues, yValues, zValues };
};
