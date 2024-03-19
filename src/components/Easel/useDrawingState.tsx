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
  // const [videoDimensions, setVideoDimensions] = useState<VideoDimensions>(canvasRef?.current ? getParentDimensions(canvasRef.current) : INITIAL_DIMENSIONS); // dimensions of the video element
  const [telestrationHistory, setTelestrationHistory] = useState<InstructionMemory[]>([]);
  const [backingInstructions, setBackingInstructions] = useState<NAnnotationPoint[]>();


  // if (canvasRef?.current && !videoDimensions) {
  //   const parentDimensions = getParentDimensions(canvasRef.current)
  //   setVideoDimensions(parentDimensions)
  // }

  // !! may need these for receiving remote drawings
  // presenceAnnotations: AVKAnnotationEvent[]; // Presence points - aka remoteHistory
  // state used to draw and send points
  // totalAnnotations: Map<Guid | null, number>;
  // telestrationEventsMap: Map<string | null, AVKAnnotationEvent[]>;
  // activeTelestrationId: Guid | null;
  // activeSequence: number;
  // previousPoint: TwoDimensionPosition;
  // sendEvent: SendEvent;
  // telestrationRetries: Map<string | null, number>; // used in receiveAVKTelestrationEndReportThunk


  // converts Host mouse interactions to drawings
//   useMouseEventHandler({
//     penStyle,
// setPenStyle,
//   videoDimensions,
//   setVideoDimensions,
//   isDrawModeOn,
//   setIsDrawModeOn,
//   telestrationHistory,
// // setTelestrationHistory,
//   canvasRef
  //   });

  // useEffect(() => {
  //   if (canvasRef?.current) {
  //     const parentDimensions = getParentDimensions(canvasRef.current)
  //     setVideoDimensions(parentDimensions)
  //   }
  // },[canvasRef])
      useEffect(() => {
    /**
     * Listening to the parent element resize in order to redraw Telestration.
     */
    console.log('%c * new useEffect', 'color: orange; background-color: transparent; font-weight: 800; font-style: italic;')
    if (canvasRef?.current?.parentElement) {

        const resizeObserver = new ResizeObserver((entries) => {
          const { width, height } = entries[0].contentRect
          if(width !== videoDimensions.width || height !== videoDimensions.height){
            setVideoDimensions({ ...videoDimensions, width, height })
          }
        })
        resizeObserver.observe(canvasRef.current.parentElement)
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