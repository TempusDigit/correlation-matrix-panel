import { PanelPlugin } from '@grafana/data';
import { CorrelationMatrixOptions, defualtCorrelationMatrixConfig } from 'models.gen';
import { CorrelationMatrixPanel } from './components/CorrelationMatrixPanel';

export const plugin = new PanelPlugin<CorrelationMatrixOptions>(CorrelationMatrixPanel).setPanelOptions((builder) => {
  return builder
    .addBooleanSwitch({
      path: 'normalize',
      name: 'Normalization',
      defaultValue: defualtCorrelationMatrixConfig.normalize,
    })
    .addColorPicker({
      path: 'colorScaleTop',
      name: 'Color scale top',
      defaultValue: defualtCorrelationMatrixConfig.colorScaleTop,
    })
    .addColorPicker({
      path: 'colorScaleBottom',
      name: 'Color scale bottom',
      defaultValue: defualtCorrelationMatrixConfig.colorScaleBottom,
    })
    .addTextInput({
      path: 'threshold',
      name: 'Hide cells with correlation <',
      settings: {
        placeholder: 'None',
      },
    });
});
