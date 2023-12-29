export interface CorrelationMatrixData {
    xValues: string[];
    yValues: string[];
    zValues: number[][];
};

export interface Info {
    data?: CorrelationMatrixData;
    warning?: string;
};
