'use client'
import { LegacyRef, MutableRefObject, createContext, useEffect, useRef, useState } from "react";

import clsx from "clsx";

import "./styles.css";
import { useMouseEventHandler } from "./useMouseEventHandler";
import { useDrawingState } from "./useDrawingState";
import { getParentDimensions } from "@/app/utils/draw";
import { InstructionMemory, NAnnotationPoint, PenStyle, VideoDimensions } from "@/app/types/drawing";
import { INITIAL_DIMENSIONS, INITIAL_PEN_COLOR, INITIAL_PEN_WIDTH } from "./constants";

interface EaselProps {
  canvasRef: MutableRefObject<HTMLCanvasElement>;
  show: boolean;
}

export const Easel = () => {
  const canvasRef = useRef<HTMLCanvasElement>()

  const [isDrawModeOn, setIsDrawModeOn] = useState<boolean>(true); // Palette is open on Host
  const [penStyle, setPenStyle] = useState<PenStyle>({ width: INITIAL_PEN_WIDTH, color: INITIAL_PEN_COLOR });
  const [videoDimensions, setVideoDimensions] = useState<VideoDimensions>(INITIAL_DIMENSIONS); // dimensions of the video element
  const [telestrationHistory, setTelestrationHistory] = useState<InstructionMemory[]>([]);
  const [backingInstructions, setBackingInstructions] = useState<NAnnotationPoint[]>();

  const DrawingContext = createContext({isDrawModeOn,
    setIsDrawModeOn,
    penStyle,
    setPenStyle,
    videoDimensions,
    setVideoDimensions,
    telestrationHistory,
    setTelestrationHistory,
    canvasRef,
    backingInstructions
  })

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

  // useEffect(() => {
  //   console.log("old Easel useEffect")
  //   if (canvasRef?.current) {
  //     const parentDimensions = getParentDimensions(canvasRef.current)
  //     setVideoDimensions(parentDimensions)
  //   }
  // },[canvasRef?.current?.parentElement])


  // send events to PubNub
  // useSendTelestrationEvents();

  return (
    <DrawingContext.Provider
      value={{
        isDrawModeOn,
        setIsDrawModeOn,
        penStyle,
        setPenStyle,
        videoDimensions,
        setVideoDimensions,
        telestrationHistory,
        setTelestrationHistory,
        canvasRef,
        backingInstructions
      }} >

      <canvas
        ref={canvasRef as LegacyRef<HTMLCanvasElement>}
        className="root"
        width={videoDimensions.width}
        height={videoDimensions.height}
      />

    </DrawingContext.Provider>
  );
};