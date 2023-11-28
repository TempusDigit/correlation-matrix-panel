export interface CorrelationMatrixOptions {
    serie: number;
    normalize: boolean;
    colorScaleTop: string;
    colorScaleBottom: string;
    threshold?: number;
}

export const defualtCorrelationMatrixConfig: CorrelationMatrixOptions = {
    serie: 0,
    normalize: true,
    colorScaleTop: '#fff5eb',
    colorScaleBottom: '#7f2704',
};
