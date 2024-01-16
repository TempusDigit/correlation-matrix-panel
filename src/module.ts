import { PanelPlugin, getFrameDisplayName } from '@grafana/data';
import { CorrelationMatrixOptions, defaultCorrelationMatrixConfig } from 'models.gen';
import { CorrelationMatrixPanel } from './components/CorrelationMatrixPanel';

export const plugin = new PanelPlugin<CorrelationMatrixOptions>(CorrelationMatrixPanel).setPanelOptions(
  (builder, context) => {
    return builder
      .addSelect({
        path: 'series',
        name: 'Data',
        defaultValue: defaultCorrelationMatrixConfig.series,
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
        defaultValue: defaultCorrelationMatrixConfig.normalize,
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
        defaultValue: defaultCorrelationMatrixConfig.colorScaleTop,
      })
      .addColorPicker({
        path: 'colorScaleBottom',
        name: 'Color scale bottom',
        defaultValue: defaultCorrelationMatrixConfig.colorScaleBottom,
      })
      .addBooleanSwitch({
        path: 'showValues',
        name: 'Show values',
        defaultValue: defaultCorrelationMatrixConfig.showValues,
      });
  });
