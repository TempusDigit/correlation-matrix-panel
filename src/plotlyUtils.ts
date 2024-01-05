import { GrafanaTheme2 } from '@grafana/data';
import { CorrelationMatrixOptions } from 'models.gen';
import { CorrelationMatrixData } from 'types';
import { Config, Annotations, Font, Layout, LayoutAxis, PlotData } from 'plotly.js/dist/plotly-custom.min.js';

export function getPlotlyTickFont(theme: GrafanaTheme2): Font {
    return {
        family: theme.typography.fontFamily,
        size: theme.typography.fontSize,
        color: theme.colors.text.primary,
    };
};

export function getPlotlyConfig(): Partial<Config> {
    return {
        displayModeBar: false
    };
}

export function getPlotlyData(
    data: CorrelationMatrixData | undefined,
    options: CorrelationMatrixOptions,
    theme: GrafanaTheme2,
    tickFont: Font
): Partial<PlotData>[] {
    if (!data) {
        return [{}];
    }

    return [
        {
            type: 'heatmap',
            x: data.xValues,
            y: data.yValues,
            z: data.zValues,
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

function getLayoutAxis(theme: GrafanaTheme2, tickFont: Partial<Font>): Partial<LayoutAxis> {
    return {
        color: theme.colors.text.primary,
        tickfont: tickFont,
        showgrid: false,
        fixedrange: true,
        automargin: true,
    };
}

function getAnnotations(data: CorrelationMatrixData, font: Partial<Font>): Partial<Annotations>[] {
    const annotations: Partial<Annotations>[] = [];

    for (let i = 0; i < data.yValues.length; i++) {
        for (let j = 0; j < data.xValues.length; j++) {
            annotations.push({
                xref: 'x',
                yref: 'y',
                x: data.xValues[j],
                y: data.yValues[i],
                text: data.zValues[i][j].toString(),
                font,
                showarrow: false,
            });
        }
    }

    return annotations;
}

export function getPlotlyLayout(
    data: CorrelationMatrixData | undefined,
    options: CorrelationMatrixOptions,
    theme: GrafanaTheme2,
    tickFont: Partial<Font>,
    width: number,
    height: number
): Partial<Layout> {
    if (!data) {
        return {};
    }

    const layoutAxis = getLayoutAxis(theme, tickFont);
    const layout: Partial<Layout> = {
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
        xaxis: layoutAxis,
        yaxis: {
            ...layoutAxis,
            autorange: 'reversed'
        },
    };

    if (options.showValues) {
        layout.annotations = getAnnotations(data, tickFont);
    }

    return layout;
};
