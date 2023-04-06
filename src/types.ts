export interface ChartData {
  x: string[];
  y: string[];
  z: (number | null)[][];
  zRaw: (number | null)[][];
  normalized: (number | null)[][];
}
