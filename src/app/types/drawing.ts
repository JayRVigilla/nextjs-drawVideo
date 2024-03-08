export interface PenStyle {
  width?: 1 | 2 | 3 | 4 | 5;
  color?: string | null;
}

export interface VideoDimensions {
  // dimensions of visible video
  width?: number;
  height?: number;
  // dimensions of aspect ratio bars
  offsetTop?: number; // TODO: used in older code, verify if this is used for FreezeFrame
  offsetLeft?: number; // TODO: used in older code, verify if this is used for FreezeFrame
  offsetWidth?: number;
  offsetHeight?: number;
}

export interface InstructionMemory {
  instructions: NAnnotationPoint[]; // TODO: bring in from avail-kit
  style: string; // hex color
}

export interface TwoDimensionPosition {
  x: number | undefined;
  y: number | undefined;
}