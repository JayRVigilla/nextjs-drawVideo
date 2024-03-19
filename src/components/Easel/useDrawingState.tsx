'use client'
import { useState, useRef, MutableRefObject, useEffect } from "react";
// import { Guid } from "guid-typescript";
import { PEN_COLOR_TO_HEX, INITIAL_DIMENSIONS, INITIAL_PEN_COLOR, INITIAL_PEN_WIDTH } from "./constants";
import { PenStyle, VideoDimensions, InstructionMemory, NAnnotationPoint } from "@/app/types/drawing";
import { drawAnnotation, getParentDimensions } from "@/app/utils/draw";
import { useMouseEventHandler } from "./useMouseEventHandler";

export const useDrawingState = () => {
  const canvasRef = useRef<HTMLCanvasElement>()

  const [isDrawModeOn, setIsDrawModeOn] = useState<boolean>(true); // Palette is open on Host
  const [penStyle, setPenStyle] = useState<PenStyle>({ width: INITIAL_PEN_WIDTH, color: INITIAL_PEN_COLOR });
  const [videoDimensions, setVideoDimensions] = useState<VideoDimensions>(INITIAL_DIMENSIONS); // dimensions of the video element
  const [telestrationHistory, setTelestrationHistory] = useState<InstructionMemory[]>([]);
  // const [backingInstructions, setBackingInstructions] = useState<NAnnotationPoint[]>();
      useEffect(() => {
        // Listening to the parent element resize in order to redraw Telestration.
        if (canvasRef?.current?.parentElement) {
          // console.log('%c * resize useEffect', 'color: orange; background-color: transparent; font-weight: 800; font-style: italic;')

        const resizeObserver = new ResizeObserver((entries) => {
          const { width, height } = entries[0].contentRect
          if (width !== videoDimensions.width || height !== videoDimensions.height) {
            const newDimensions = { ...videoDimensions, width, height }
            setVideoDimensions(newDimensions)
            telestrationHistory.forEach((blob: InstructionMemory) => {
              console.log("redraw", blob)
              drawAnnotation(blob.style, blob.instructions, newDimensions, canvasRef)
            })
            console.log('%c * resizeObserver - telestrationHistory ', 'color: #3366CC; background-color: transparent; font-weight: 800; font-style: italic;', {telestrationHistory})
          }
        })
      resizeObserver.observe(canvasRef.current.parentElement)
      // TODO: redraw from telestrationHistory
      }
    }, [canvasRef, videoDimensions, setVideoDimensions, telestrationHistory]);

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