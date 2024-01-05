import { PanelPlugin, getFrameDisplayName } from '@grafana/data';
import { CorrelationMatrixOptions, defualtCorrelationMatrixConfig } from 'models.gen';
import { CorrelationMatrixPanel } from './components/CorrelationMatrixPanel';

export const plugin = new PanelPlugin<CorrelationMatrixOptions>(CorrelationMatrixPanel).setPanelOptions(
  (builder, context) => {
    return builder
      .addSelect({
        path: 'series',
        name: 'Data',
        defaultValue: defualtCorrelationMatrixConfig.series,
        settings: {
          options: context.data.map((frame, index) => ({
            value: index,
            label: getFrameDisplayName(frame, index),
          }))
        }
      })
      .addBooleanSwitch({
        path: 'normalize',
        name: 'Normalize data',
        defaultValue: defualtCorrelationMatrixConfig.normalize,
      })
      .addTextInput({
        path: 'threshold',
        name: 'Hide cells with correlation <',
        settings: {
          placeholder: 'None',
        },
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
      .addBooleanSwitch({
        path: 'showValues',
        name: 'Show values',
        defaultValue: defualtCorrelationMatrixConfig.showValues,
      });
  });
