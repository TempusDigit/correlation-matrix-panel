import React, { useMemo } from 'react';
import { PanelProps } from '@grafana/data';
import { CorrelationMatrixOptions } from 'models.gen';
import { useTheme2 } from '@grafana/ui';
import Plotly from 'plotly.js/dist/plotly-custom.min.js';
import createPlotlyComponent from 'react-plotly.js/factory';
import { PanelDataErrorView } from '@grafana/runtime';
import { TEST_SELECTORS } from 'consts';
import { getPlotlyConfig, getPlotlyData, getPlotlyLayout, getPlotlyTickFont } from 'plotlyUtils';
import { getInfo } from 'utils';

interface Props extends PanelProps<CorrelationMatrixOptions> { }

const Plot = createPlotlyComponent(Plotly);

export const CorrelationMatrixPanel: React.FC<Props> = ({ data, fieldConfig, height, id, options, width }) => {
  const theme = useTheme2();
  const tickFont = useMemo(() => getPlotlyTickFont(theme), [theme]);
  const info = useMemo(() => getInfo(data.series, options), [data.series, options]);
  const plotlyConfig = useMemo(() => getPlotlyConfig(), []);
  const plotlyData = useMemo(() => getPlotlyData(info, theme, options, tickFont), [info, theme, options, tickFont]);
  const plotlyLayout = useMemo(() => getPlotlyLayout(theme, tickFont, width, height), [theme, tickFont, width, height]);

  if (info.warning) {
    return <PanelDataErrorView
      panelId={id}
      fieldConfig={fieldConfig}
      data={data}
      message={info.warning}
    />;
  }

  return <Plot
    divId={TEST_SELECTORS.plotlyChart.root}
    config={plotlyConfig}
    data={plotlyData}
    layout={plotlyLayout}
  />;
};
