import React, {
  useEffect,
  useRef,
  useState
} from 'react';
import {
  Field,
  PanelProps
} from '@grafana/data';
import { CorrelationMatrixOptions } from 'types';
import { css } from '@emotion/css';
import {
  useStyles2,
  useTheme2
} from '@grafana/ui';
import Plot from 'react-plotly.js';
import tinycolor from 'tinycolor2';
import { PanelDataErrorView } from '@grafana/runtime';

interface Props extends PanelProps<CorrelationMatrixOptions> { }

const getStyles = () => {
  return {
    wrapper: css`
      font-family: Open Sans;
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
  };
};

// const getTextInfo = (labelDisplayOptions: string[]) => {
//   if (labelDisplayOptions[0] === "n" || labelDisplayOptions.length === 0) {
//     return 'none' as TextInfoType;
//   }

//   const options = [{ name: "label", selected: false }, { name: "value", selected: false }, { name: "percent", selected: false }];
//   labelDisplayOptions.forEach(selectedOption => {
//     for (const option of options) {
//       if (option.name === selectedOption) {
//         option.selected = true;
//         break;
//       }
//     }
//   });
//   return options.filter(option => option.selected).map(option => option.name).join('+') as TextInfoType
// }

const getRange = (fields: Field[]) => {
  let min = Number.MAX_VALUE;
  let max = Number.MIN_VALUE;
  for (let i = 1; i < fields.length; i++) {
    fields[i].values.toArray().forEach(value => {
      if (value < min) {
        min = value;
      }
      if (value > max) {
        max = value;
      }
    });
  }
  return { min, max };
}

const normalize = (min: number, max: number, value: number) => {
  return (value - min) / (max - min) * 2 - 1
}

export const CorrelationMatrixPanel: React.FC<Props> = ({ data, id, fieldConfig, options }) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  const range = useRef({ min: Number.MAX_VALUE, max: Number.MIN_VALUE });
  const [chartData, setChartData] = useState<{ x: string[], y: string[], z: (number | null)[][], zRaw: (number | null)[][], normalized: (number | null)[][] }>({ x: [], y: [], z: [], zRaw: [], normalized: [] });
  const dataValid = data.series.length && data.series[0].fields.length - 1 === data.series[0].fields[0].values.length;

  useEffect(() => {
    if (dataValid) {
      const fieldsSlice = data.series[0].fields.slice(1);
      // Instead of two maps, you can construct x and z arrays with one loop.
      const zValues: number[][] = fieldsSlice.map(field => field.values.toArray());
      const localRange = getRange(data.series[0].fields);
      if (range.current.min !== localRange.min || range.current.max !== localRange.max) {
        range.current = localRange;
      }
      const normalizedValues: number[][] = zValues.length === 1 ? [[0]] : zValues.map(values => values = values.map(value => normalize(localRange.min, localRange.max, value)));
      setChartData({
        x: fieldsSlice.map(field => field.name),
        y: data.series[0].fields[0].values.toArray(),
        z: zValues,
        zRaw: zValues,
        normalized: normalizedValues,
      });
    }
  }, [dataValid, data]);

  if (!dataValid) {
    return <PanelDataErrorView panelId={id} fieldConfig={fieldConfig} data={data} />;
  }

  const style = {
    width: "100%",
    height: "100%"
  };
  const tickFont = {
    family: theme.typography.fontFamily,
    size: theme.typography.fontSize,
    color: theme.colors.text.primary,
  };
  const axisSettings = {
    color: theme.colors.text.primary,
    tickfont: tickFont,
    showgrid: false,
    fixedrange: true,
    automargin: true,
  };
  
  // Sub-optimal solution as this method runs every render. Should be moved to a useEffect. However, chartData is empty on load in useEffect and only displays on refresh. 
  const handleThreshold = () => {
    const zValues: (number | null)[][] = options.normalize ? chartData.normalized : chartData.z;
    if (options.threshold !== undefined) {
      const labels: string[] = [];
      const zValuesTrimmed: (number | null)[][] = [];
      chartData.normalized.forEach((columnValues, colIndex) => {
        let uncorrCount = 1
        columnValues.forEach(value => {
          if (value != null && (Math.abs(value) < options.threshold)) {
            uncorrCount++;
          }
        });
        if (uncorrCount !== columnValues.length) {
          labels.push(chartData.x[colIndex]);
          zValuesTrimmed.push(zValues[colIndex]);
        }
      });
      return { x: labels, y: labels, z: zValuesTrimmed };
    }
    return { x: chartData.x, y: chartData.y, z: zValues };
  }

  const getColor = (color: string) => {
    if (color === "transparent") {
      return color;
    }
    return color.startsWith('#') ? color : '#' + tinycolor(theme.visualization.getColorByName(color)).toHex()
  }

  return (
    <div style={style}>
      {/* <Plot
        className={styles.svg}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
        layout={{
          autosize: true,
          paper_bgcolor: "transparent",
          legend: {
            font: {
              color: theme.colors.text.primary
            }
          },
        }}
        data={[
          {
            values: data.series[0].fields.find(field => field.name === options.displayField)?.values.toArray(),
            labels: data.series[0].fields.filter(field => field.name !== options.displayField && field.type === FieldType.string).reduce((labelField: string[], field) => {
              field.values.toArray().forEach((fieldValue: any, index: number) => {
                if (labelField[index] === undefined) {
                  labelField[index] = fieldValue
                } else {
                  labelField[index] += ` ${fieldValue}`
                }
              });
              return labelField;
            }, []),
            type: 'pie',
            textinfo: getTextInfo(options.labelDisplayOptions)
          }
        ]}
      /> */}

      <Plot
        className={styles.svg}
        useResizeHandler
        style={style}
        layout={{
          autosize: true,
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          xaxis: axisSettings,
          yaxis: {
            ...axisSettings,
            autorange: 'reversed'
          },
          margin: {
            t: 10,
            r: 10,
            b: 20,
            l: 20,
          },
        }}
        config={{
          displayModeBar: false,
        }}
        data={[{
          type: "heatmap",
          ...handleThreshold(),
          // z: options.normalize ? chartData.normalized : chartData.z,
          colorscale: [
            [0, getColor(options.colorScaleBottom)],
            [1, getColor(options.colorScaleTop)],
          ],
          colorbar: {
            outlinewidth: 0,
            tickcolor: theme.colors.text.primary,
            tickfont: tickFont,
          },
        }]}
      />
    </div>
  );
};
