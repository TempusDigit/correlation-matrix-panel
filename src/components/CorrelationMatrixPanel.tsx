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
  const tickFont = getPlotlyTickFont(theme);
  const info = useMemo(() => getInfo(data.series, options), [data.series, options]);
  const plotlyLayout = useMemo(
    () => getPlotlyLayout(info.data, options, theme, tickFont, width, height),
    [info.data, options, theme, tickFont, width, height]
  );

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
    config={getPlotlyConfig()}
    data={getPlotlyData(info.data, options, theme, tickFont)}
    layout={plotlyLayout}
  />;
};
