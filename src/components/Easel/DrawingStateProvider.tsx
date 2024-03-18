'use client'
import { useState, useRef, MutableRefObject, useEffect, createContext, ReactNode } from "react";
// import { Guid } from "guid-typescript";
import { PEN_COLOR_TO_HEX, INITIAL_DIMENSIONS, INITIAL_PEN_COLOR, INITIAL_PEN_WIDTH } from "./constants";
import { PenStyle, VideoDimensions, InstructionMemory, NAnnotationPoint } from "@/app/types/drawing";
import { getParentDimensions } from "@/app/utils/draw";
import { useMouseEventHandler } from "./useMouseEventHandler";

export const DrawingStateProvider = ({children} : {children: ReactNode}) => {
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
  useEffect(() => {
    if (canvasRef?.current) {
      const parentDimensions = getParentDimensions(canvasRef.current)
      setVideoDimensions(parentDimensions)
    }
  },[canvasRef])

    // useEffect(() => {
    // /**
    //  * Listening to the video element resize in order to redraw Telestration.
    //  * Using the ResizeObserver API instead of useEventListener since using
    //  * videoDimensions as a dependency is unreliable for real-time
    //  * resize events.
    //  * https:// developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
    //  */
    //   if (canvasRef?.current?.parentElement) {
    //     const resizeObserver = new ResizeObserver((entries) => {
    //       console.log("resize", entries)
    //     })
    //     resizeObserver.observe(canvasRef.current.parentElement)
    //   }
    // }, [canvasRef?.current?.parentElement]);

  return (
    <DrawingContext.Provider value={{isDrawModeOn,
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
      {children}
    </DrawingContext.Provider>
  )
}