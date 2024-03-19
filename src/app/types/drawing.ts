export type PenWidth = 1 | 2 | 3 | 4 | 5
export interface PenStyle {
  width: PenWidth;
  color: string;
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

export interface NAnnotationInstruction {
  x?: number;
  y?: number;
  widthFromPoint?: number;
}

export class NAnnotationPoint implements NAnnotationInstruction {
  public static universalModelType(): string {
    return 'io.avail.models.annotations.point.v1';
  }

  private _x!: number;
  private _y!: number;
  private _widthFromPoint!: number;

  constructor(x: number, y: number, widthFromPoint: number) {
    // super();
    this._x = x;
    this._y = y;
    this._widthFromPoint = widthFromPoint;
  }

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }

  get widthFromPoint(): number {
    return this._widthFromPoint;
  }

  set widthFromPoint(value: number) {
    this._widthFromPoint = value;
  }
}

export interface IPosition {
  x: number;
  y: number;
  browserY?: number;
}

export interface InstructionMemory {
  instructions: NAnnotationPoint[];
  style: string; // hex color
}