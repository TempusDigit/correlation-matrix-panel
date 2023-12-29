import React, { useMemo } from 'react';
import { PanelProps } from '@grafana/data';
import { CorrelationMatrixOptions } from 'models.gen';
import { useTheme2 } from '@grafana/ui';
import Plotly, { Config } from 'plotly.js/dist/plotly-custom.min.js';
import createPlotlyComponent from 'react-plotly.js/factory';
import { prepareCorrelationMatrixData } from 'utils';
import { PanelDataErrorView } from '@grafana/runtime';
import { TEST_SELECTORS } from 'consts';
import { getPlotlyAxisSettings, getPlotlyData, getPlotlyLayout, getPlotlyTickFont } from 'plotlyUtils';
import { Info } from 'types';

interface Props extends PanelProps<CorrelationMatrixOptions> { }

const Plot = createPlotlyComponent(Plotly);

export const CorrelationMatrixPanel: React.FC<Props> = ({ data, fieldConfig, height, id, options, width }) => {
  const theme = useTheme2();
  const tickFont = useMemo(() => getPlotlyTickFont(theme), [theme]);
  const axisSettings = useMemo(() => getPlotlyAxisSettings(theme, tickFont), [theme, tickFont]);
  const info: Info = useMemo(() => {
    try {
      return { data: prepareCorrelationMatrixData(data.series, options) };
    } catch (e: any) {
      return { warning: e.message };
    }
  }, [data.series, options]);
  const plotlyConfig: Partial<Config> = { displayModeBar: false };
  const plotlyData = useMemo(() => getPlotlyData(info, theme, options, tickFont), [info, theme, options, tickFont]);
  const plotlyLayout = useMemo(() => getPlotlyLayout(width, height, axisSettings), [width, height, axisSettings]);

  if ('warning' in info) {
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
