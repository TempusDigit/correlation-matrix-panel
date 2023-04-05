import { PanelPlugin } from '@grafana/data';
import { CorrelationMatrixOptions } from './types';
import { CorrelationMatrixPanel } from './components/CorrelationMatrixPanel';

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
    // .addTextInput({
    //   path: 'scaleMin',
    //   name: 'Start color scale from value',
    //   settings: {
    //     placeholder: 'Auto (min)',
    //   },
    // })
    // .addTextInput({
    //   path: 'scaleMax',
    //   name: 'End color scale at value',
    //   settings: {
    //     placeholder: 'Auto (max)',
    //   },
    // });
});
