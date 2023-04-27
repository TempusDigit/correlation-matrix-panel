import React, { useEffect, useRef, useState } from 'react';
import { Field, PanelProps } from '@grafana/data';
import { ChartData } from 'types';
import { css } from '@emotion/css';
import { useStyles2, useTheme2 } from '@grafana/ui';
import Plot from 'react-plotly.js';
import tinycolor from 'tinycolor2';
import { PanelDataErrorView } from '@grafana/runtime';
import { CorrelationMatrixOptions } from 'models.gen';

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

/**
 * Finds min and max value for use in normalization.
 * 
 * @remarks
 * Grafana automatically finds min and max values for a field. So, I could get the value from there.
 */
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
  const [chartData, setChartData] = useState<ChartData>({ x: [], y: [], z: [], zRaw: [], normalized: [] });
  const dataValid = data.series.length > 0 && data.series[0].fields.length - 1 === data.series[0].fields[0].values.length;

  useEffect(() => {
    if (dataValid) {
      const fieldsSlice = data.series[0].fields.slice(1);
      // Instead of two maps, you can construct x and z arrays with one loop.
      const zValues: number[][] = fieldsSlice.map(field => field.values.toArray());
      const localRange = getRange(data.series[0].fields);
      if (range.current.min !== localRange.min || range.current.max !== localRange.max) {
        range.current = localRange;
      }
      // Data might not be normalized.
      const normalizedValues: number[][] = zValues.length === 1 ? [[0]] : zValues.map(values => values = values.map(value => normalize(localRange.min, localRange.max, value)));
      // Raw and normalized data is stored for fast switching between modes from the options panel when the data size grows. It might not be wise to store it though. Need to ponder.
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
    // eslint-disable-next-line @typescript-eslint/array-type
    const zValues: (number | null)[][] = options.normalize ? chartData.normalized : chartData.z;
    if (options.threshold !== undefined) {
      const labels: string[] = [];
      // eslint-disable-next-line @typescript-eslint/array-type
      const zValuesTrimmed: (number | null)[][] = [];
      // A column is not added to the visualization data if all the values in that column expect one (that is expected to equal one) do not correlate (lower than threshold).
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

  /**
   * Gets a hex color code from the color picker value.
   * 
   * @remarks
   * The Grafana color picker has some non standard color names, such as 'light-blue' which are not standard css colors. So, the color parser that Grafana uses is used to get the hex.
   */
  const getColor = (color: string) => {
    if (color === "transparent") {
      return color;
    }
    return color.startsWith('#') ? color : '#' + tinycolor(theme.visualization.getColorByName(color)).toHex()
  }

  return (
    <div style={style}>
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
          // Use the useMemo hook instead of calling it here!
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
