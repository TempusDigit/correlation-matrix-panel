import { PanelPlugin } from '@grafana/data';
import { CorrelationMatrixPanel } from './components/CorrelationMatrixPanel';
import { CorrelationMatrixOptions } from 'models.gen';

export const plugin = new PanelPlugin<CorrelationMatrixOptions>(CorrelationMatrixPanel).setPanelOptions((builder) => {
  return builder
    // .addSelect({
    //   path: 'chartType',
    //   name: 'Chart type',
    //   settings: {
    //     options: [
    //       {
    //         value: 'correlationMatrix',
    //         label: 'Correlation matrix',
    //       },
    //       {
    //         value: '3DCluster',
    //         label: '3D cluster'
    //       },
    //     ],
    //   },
    // })
    .addBooleanSwitch({
      path: 'normalize',
      name: 'Normalization',
      defaultValue: true,
    })
    .addColorPicker({
      path: 'colorScaleTop',
      defaultValue: 'orange',
      name: 'Color scale top',
    })
    .addColorPicker({
      path: 'colorScaleBottom',
      defaultValue: 'transparent',
      name: 'Color scale bottom',
    })
    .addTextInput({
      path: 'threshold',
      name: 'Hide cells with correlation <',
      settings: {
        placeholder: 'None',
      },
    });
});
