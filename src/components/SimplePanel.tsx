import React from 'react';
import { GrafanaTheme2, PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { useTheme2 } from '@grafana/ui';
import { defaults } from 'lodash';
import Plotly from 'plotly.js/dist/plotly-custom.min.js';
import createPlotlyComponent from 'react-plotly.js/factory';
import { TestIds } from '../test-ids';

interface Props extends PanelProps<SimpleOptions> {}

const Plot = createPlotlyComponent(Plotly);

// defaultLayout resets the Plotly layout to work better with the Grafana theme.
const defaultLayout = (theme: GrafanaTheme2) => ({
  margin: {
    r: 40,
    l: 40,
    t: 40,
    b: 40,
  },
  plot_bgcolor: 'rgba(0,0,0,0)', // Transparent
  paper_bgcolor: 'rgba(0,0,0,0)', // Transparent
  font: {
    color: theme.visualization.getColorByName(theme.isDark ? 'white' : 'black'),
  },
});

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme2();

  const plotlyData: Plotly.Data[] = [
    {
      x: [1, 2, 3],
      y: [2, 6, 3],
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'red' },
    },
    { type: 'bar', x: [1, 2, 3], y: [2, 5, 3] },
    { type: 'heatmap', x: [1, 2, 3], y: [2, 5, 3], z: [2, 5, 3] },
  ];

  const plotlyLayout: Partial<Plotly.Layout> = defaults(
    {
      width: width,
      height: height,
    },
    defaultLayout(theme)
  );

  return <Plot data-testid={TestIds.correlationMatrixGraph.root} data={plotlyData} layout={plotlyLayout} />;
};
