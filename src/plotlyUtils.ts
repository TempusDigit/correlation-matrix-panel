import { GrafanaTheme2 } from '@grafana/data';
import { CorrelationMatrixOptions } from 'models.gen';
import { Font, Layout, LayoutAxis, PlotData } from 'plotly.js';
import { Info } from 'types';

export function getPlotlyTickFont(theme: GrafanaTheme2): Font {
    return {
        family: theme.typography.fontFamily,
        size: theme.typography.fontSize,
        color: theme.colors.text.primary,
    };
};

export function getPlotlyAxisSettings(theme: GrafanaTheme2, tickFont: Partial<Font>): Partial<LayoutAxis> {
    return {
        color: theme.colors.text.primary,
        tickfont: tickFont,
        showgrid: false,
        fixedrange: true,
        automargin: true,
    };
};

export function getPlotlyData(
    info: Info,
    theme: GrafanaTheme2,
    options: CorrelationMatrixOptions,
    tickFont: Font
): Partial<PlotData>[] {
    if (!info.data) {
        return [{}];
    }

    return [
        {
            type: 'heatmap',
            x: info.data.xValues,
            y: info.data.yValues,
            z: info.data.zValues,
            colorscale: [
                [0, theme.visualization.getColorByName(options.colorScaleBottom)],
                [1, theme.visualization.getColorByName(options.colorScaleTop)],
            ],
            colorbar: {
                outlinewidth: 0,
                tickcolor: theme.colors.text.primary,
                tickfont: tickFont,
            },
        },
    ];
};

export function getPlotlyLayout(width: number, height: number, axisSettings: Partial<LayoutAxis>): Partial<Layout> {
    return {
        width,
        height,
        margin: {
            t: 0,
            r: 0,
            b: 0,
            l: 0,
        },
        plot_bgcolor: 'transparent',
        paper_bgcolor: 'transparent',
        xaxis: axisSettings,
        yaxis: {
            ...axisSettings,
            autorange: 'reversed'
        },
    };
};
