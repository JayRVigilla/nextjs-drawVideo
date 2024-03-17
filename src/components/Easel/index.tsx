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
  canvasRef
} = useDrawingState()
  // allows Participants to receive annotationEvents and see live drawings
  // useTelestrationSubscriptions();
// console.log('EAsel', canvasRef)
  // converts Host mouse interactions to drawings
  useMouseEventHandler({
    penStyle,
setPenStyle,
  videoDimensions,
  setVideoDimensions,
  isDrawModeOn,
  setIsDrawModeOn,
  telestrationHistory,
// setTelestrationHistory,
  canvasRef
  });

  // send events to PubNub
  // useSendTelestrationEvents();

  return (
    <canvas
      ref={canvasRef as LegacyRef<HTMLCanvasElement>}
      className="root"
    />
  );
};