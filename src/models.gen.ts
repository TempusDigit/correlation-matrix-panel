export interface CorrelationMatrixOptions {
    series: number;
    normalize: boolean;
    threshold?: number;
    colorScaleTop: string;
    colorScaleBottom: string;
    showValues: boolean;
}

export const defaultCorrelationMatrixConfig: CorrelationMatrixOptions = {
    series: 0,
    normalize: true,
    colorScaleTop: '#fff5eb',
    colorScaleBottom: '#7f2704',
    showValues: false,
};
