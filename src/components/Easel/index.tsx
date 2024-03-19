import { LegacyRef, MutableRefObject } from "react";

import clsx from "clsx";

import "./styles.css";
import { useMouseEventHandler } from "./useMouseEventHandler";
import { useDrawingState } from "./useDrawingState";

interface EaselProps {
  canvasRef: MutableRefObject<HTMLCanvasElement>;
  show: boolean;
}

export const Easel = () => {
const {isDrawModeOn,
    setIsDrawModeOn,
    penStyle,
    setPenStyle,
    videoDimensions,
    setVideoDimensions,
    telestrationHistory,
    setTelestrationHistory,
  canvasRef,
} = useDrawingState()

  // converts Host mouse interactions to drawings
  useMouseEventHandler({
    penStyle,
    videoDimensions,
    setVideoDimensions,
    isDrawModeOn,
    telestrationHistory,
    setTelestrationHistory,
    canvasRef,
  });


  return (
    <canvas
      ref={canvasRef as LegacyRef<HTMLCanvasElement>}
      className="root"
      width={videoDimensions.width}
      height={videoDimensions.height}
    />
  );
};