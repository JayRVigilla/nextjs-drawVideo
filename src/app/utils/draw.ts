import { MutableRefObject } from "react";
import { PenStyle, PenWidth, TwoDimensionPosition } from "../types/drawing";
import { NAnnotationInstruction, VideoDimensions, NAnnotationPoint } from "../types/drawing";
import { INITIAL_PEN_WIDTH } from "@/components/Easel/constants";

export const draw = (
  pointFrom: TwoDimensionPosition,
  pointTo: TwoDimensionPosition,
  style: PenStyle,
  canvas: HTMLCanvasElement
) => {
  const context = canvas.getContext("2d");

  if(!context) return
  context.beginPath();
  if (context) {
    // styling to the lines
    context.lineWidth = style.width;
    context.strokeStyle = style.color; // color
    context.lineCap = "round"; // end of lines is rounded not squared off
    context.lineJoin = "round"; // rounds corners where lines meet

    // coordinates not able to be undefined here
    context.moveTo(pointFrom.x as number, pointFrom.y as number);
    context.lineTo(pointTo.x as number, pointTo.y as number);
    context.stroke();
    context.closePath();
  }
};

export const rgbToHex = (
  redValue: number,
  greenValue: number,
  blueValue: number
) => {
  const r = Math.floor(redValue * 255).toString(16);
  const g = Math.floor(greenValue * 255).toString(16);
  const b = Math.floor(blueValue * 255).toString(16);

  const convert = (value: string) => {
    return value.length === 1 ? `0${value}` : value;
  };

  return `#${convert(r)}${convert(g)}${convert(b)}`;
};

// requires a 6 character hex color.
// i.e. white !== "#fff" => white === "#ffffff"
export const hexToRgbA = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb("${r},${g},${b}")`;
};

// returns coordinates relative to LOCAL video element's dimensions
export const denormalizeInstruction = (
  instruction: NAnnotationInstruction,
  videoDimensions: VideoDimensions
): NAnnotationInstruction => {
  if (!instruction.x || !instruction.y) {
    throw new Error("Could not denormalize coordinates for instruction");
  }

  return new NAnnotationPoint(
    // instruction.x and instruction.y are fractions of the total width
    (videoDimensions.width ?? 1) * instruction.x,
    (videoDimensions.height ?? 1) * instruction.y,
    instruction.widthFromPoint || INITIAL_PEN_WIDTH // if no penWidth given, default to INITIAL_PEN_WIDTH
  );
};

// returns coordinates relative to ANY video element's dimensions
export const normalizeInstruction = (
  anInstruction: NAnnotationInstruction,
  videoDimensions: VideoDimensions,
  penWidth: PenWidth
) => {
  if (!anInstruction.x || !anInstruction.y) {
    throw new Error("Could not normalize coordinates for instruction");
  }

  const aPoint: NAnnotationPoint = new NAnnotationPoint(
    anInstruction.x / (videoDimensions.width ?? 1),
    anInstruction.y / (videoDimensions.height ?? 1),
    penWidth
  );
  return aPoint;
};

// used in MP call when drawing telestrationHistory pulled from Presence
export const drawAnnotation = (
  style: string, // expecting HEX color
  instructions: NAnnotationInstruction[],
  videoDimensionsObject: VideoDimensions,
  canvasRef: MutableRefObject<HTMLCanvasElement | undefined>
) => {
  const canvas = canvasRef.current;
  if(canvas === undefined) return
  const context = canvas.getContext("2d");
  [...instructions].forEach((instruction, i) => {
    const nextPoint = [...instructions][i + 1];
    if (nextPoint && context) {
      try {
        const pointFrom = denormalizeInstruction(
          instruction,
          videoDimensionsObject
        );
        const pointTo = denormalizeInstruction(
          nextPoint,
          videoDimensionsObject
        );
        const styles = {
          width: instruction.widthFromPoint,
          color: style,
        } as PenStyle;
        draw(
          pointFrom as TwoDimensionPosition,
          pointTo as TwoDimensionPosition,
          styles,
          canvas
        );
      } catch (error: any) {
        console.warn("Skipping annotation instructions.", error?.message);
      }
    }
  });
};

export const getParentDimensions = (canvas: HTMLCanvasElement): VideoDimensions => {
  // const videoEl = getConsoleVideoElement();
  const parentElement = canvas?.parentElement as HTMLDivElement;

  // offset = actual dimensions, video = original dimensions (default: 1280x720)
  const {
    offsetWidth,
    offsetHeight,
    // videoWidth,
    // videoHeight,
    offsetLeft,
    offsetTop,
  } = canvas;


  const offsetRatio = offsetWidth / offsetHeight;
  // const videoRatio = videoWidth === videoHeight ? 1 : videoWidth / videoHeight; // ternary prevents 0/0 = NaN

  let width = offsetWidth;
  let height = offsetHeight;

  const canvasDimensions = {
    offsetWidth,
    offsetHeight,
    offsetLeft,
    offsetTop,
  }

  const offsetDimensions = {
    offsetWidth: (parentElement?.clientWidth - width) / 2 || 0,
    offsetHeight: (parentElement?.clientHeight - height) / 2 || 0,}

  // If the video element is short and wide (landscape)
  // if (offsetRatio > videoRatio) {
  //   width = height * videoRatio;
  // }
  // // If the video element is tall and thin (portrait), or exactly equal to the original ratio
  // else {
  //   height = width / videoRatio;
  // }

  console.info(
    `Getting new video dimensions ${JSON.stringify({ width, height })}`
  );

  return {
    width,
    height,
    offsetLeft,
    offsetTop,
    offsetWidth: (parentElement?.clientWidth - width) / 2 || 0,
    offsetHeight: (parentElement?.clientHeight - height) / 2 || 0,
  };
};