'use client'
import { useState, useRef, MutableRefObject, useEffect, useCallback } from "react";
import { INITIAL_DIMENSIONS, INITIAL_PEN_COLOR, INITIAL_PEN_WIDTH } from "./constants";
import { PenStyle, VideoDimensions, InstructionMemory, NAnnotationPoint } from "@/app/types/drawing";
import { clearCanvas, drawAnnotation} from "@/app/utils/draw";

export const useDrawingState = () => {
  const canvasRef = useRef<HTMLCanvasElement>()

  const [isDrawModeOn, setIsDrawModeOn] = useState<boolean>(true); // Palette is open on Host
  const [penStyle, setPenStyle] = useState<PenStyle>({ width: INITIAL_PEN_WIDTH, color: INITIAL_PEN_COLOR });
  const [videoDimensions, setVideoDimensions] = useState<VideoDimensions>(INITIAL_DIMENSIONS); // dimensions of the video element
  const [telestrationHistory, setTelestrationHistory] = useState<InstructionMemory[]>([]);

  const redrawLocalAnnotations = useCallback((newDimensions: VideoDimensions) => {
    setVideoDimensions(newDimensions)
    console.log('%c * resizeObserver - telestrationHistory ', 'color: #3366CC; background-color: transparent; font-weight: 800; font-style: italic;', { telestrationHistory })
    setTimeout(() => {
      if (!canvasRef.current) return
      // console.log("redraw")
      clearCanvas(canvasRef.current, newDimensions)
      telestrationHistory.forEach((blob: InstructionMemory) => {
      drawAnnotation(blob.style, blob.instructions, newDimensions, canvasRef)
      })
  }, 250)
  }, [telestrationHistory])
  
  useEffect(() => {
    // Listening to the parent element resize in order to redraw Telestration.
    if (canvasRef?.current?.parentElement) {

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      if (width !== videoDimensions.width || height !== videoDimensions.height) {
        const newDimensions = { width, height }
        // setVideoDimensions(newDimensions)
        // telestrationHistory.forEach((blob: InstructionMemory) => {
        //   console.log("redraw", blob)
        //   drawAnnotation(blob.style, blob.instructions, newDimensions, canvasRef)
        // })
        redrawLocalAnnotations(newDimensions)
        // console.log('%c * resizeObserver - telestrationHistory ', 'color: #3366CC; background-color: transparent; font-weight: 800; font-style: italic;', {telestrationHistory})
      }
    })
  resizeObserver.observe(canvasRef.current.parentElement)
  // TODO: redraw from telestrationHistory
  }
}, [canvasRef, videoDimensions, redrawLocalAnnotations]);

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