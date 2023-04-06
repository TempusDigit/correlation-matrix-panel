// export type TextInfoType = 'label'
//   | 'label+value'
//   | 'label+percent'
//   | 'label+value+percent'
//   | 'value'
//   | 'value+percent'
//   | 'percent'
//   | 'none';

export interface CorrelationMatrixOptions {
    normalize: boolean;
    colorScaleTop: string;
    colorScaleBottom: string;
    threshold: number;
}
