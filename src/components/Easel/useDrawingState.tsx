'use client'
import { useState, useRef, MutableRefObject, useEffect } from "react";
// import { Guid } from "guid-typescript";
import { PEN_COLOR_TO_HEX, INITIAL_DIMENSIONS, INITIAL_PEN_COLOR, INITIAL_PEN_WIDTH } from "./constants";
import { PenStyle, VideoDimensions, InstructionMemory, NAnnotationPoint } from "@/app/types/drawing";
import { getParentDimensions } from "@/app/utils/draw";
import { useMouseEventHandler } from "./useMouseEventHandler";

export const useDrawingState = () => {
  const canvasRef = useRef<HTMLCanvasElement>()

  // if (canvasRef?.current) {
  //   const parent = getParentDimensions(canvasRef.current)
  //   console.log('useDrawingState', canvasRef, parent)
  // }

  const [isDrawModeOn, setIsDrawModeOn] = useState<boolean>(true); // Palette is open on Host
  const [penStyle, setPenStyle] = useState<PenStyle>({ width: INITIAL_PEN_WIDTH, color: INITIAL_PEN_COLOR });
  const [videoDimensions, setVideoDimensions] = useState<VideoDimensions>(INITIAL_DIMENSIONS); // dimensions of the video element
  const [telestrationHistory, setTelestrationHistory] = useState<InstructionMemory[]>([]);
  // const [backingInstructions, setBackingInstructions] = useState<NAnnotationPoint[]>();
      useEffect(() => {
    // Listening to the parent element resize in order to redraw Telestration.
    if (canvasRef?.current?.parentElement) {

        const resizeObserver = new ResizeObserver((entries) => {
          const { width, height } = entries[0].contentRect
          if(width !== videoDimensions.width || height !== videoDimensions.height){
            setVideoDimensions({ ...videoDimensions, width, height })
          }
        })
      resizeObserver.observe(canvasRef.current.parentElement)
      // TODO: redraw from telestrationHistory
      }
    }, [canvasRef, videoDimensions, setVideoDimensions]);

  return {
    isDrawModeOn,
    setIsDrawModeOn,
    penStyle,
    setPenStyle,
    videoDimensions,
    setVideoDimensions,
    telestrationHistory,
    setTelestrationHistory,
    canvasRef,
  }

}