import { VideoDimensions } from "@/app/types/drawing";

export const INITIAL_DIMENSIONS: VideoDimensions = {
  width: 0,
  height: 0,
  offsetTop: 0,
  offsetLeft: 0,
  offsetWidth: 0,
  offsetHeight: 0,
};

export const INITIAL_PREVIOUS_POINT = {
  x: undefined,
  y: undefined,
};

export const PEN_COLOR_TO_HEX = {
  red: "#ff005c", // $pen-red
  blue: "#0094ff", // $pen-blue
  green: "#00ff53", // $pen-green
  yellow: "#fff500", // $pen-yellow
  black: "#181819", // $pen-black
  white: "#ffffff", // $pen-white - requires 6 characters for NAnnotation.setRGBA
}

export const HEX_TO_PEN_COLOR = {
  [PEN_COLOR_TO_HEX.red]: "red",
  [PEN_COLOR_TO_HEX.blue]: "blue",
  [PEN_COLOR_TO_HEX.green]: "green",
  [PEN_COLOR_TO_HEX.yellow]: "yellow",
  [PEN_COLOR_TO_HEX.black]: "black",
  [PEN_COLOR_TO_HEX.white]: "white",
};

export const INITIAL_PEN_WIDTH = 4;

export const INITIAL_PEN_COLOR = PEN_COLOR_TO_HEX.green;

export const MAX_ANNOTATION_POINTS: number =
  parseInt(`${process.env.REACT_APP_MAX_ANNOTATION_POINTS}`, 10) || 20;