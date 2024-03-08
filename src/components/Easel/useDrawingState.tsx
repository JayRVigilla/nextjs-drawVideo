'use client'
import { useState, useRef } from "react";
// import { Guid } from "guid-typescript";
import { PEN_COLOR_TO_HEX, INITIAL_DIMENSIONS, INITIAL_PEN_COLOR, INITIAL_PEN_WIDTH } from "./constants";
import { PenStyle, VideoDimensions, InstructionMemory } from "@/app/types/drawing";

export const useDrawingState = () => {
  const canvasRef = useRef()

  const [isDrawModeOn, setIsDrawModeOn] = useState<boolean>(false); // Palette is open on Host
  const [penStyle, setPenStyle] = useState<PenStyle>({ width: INITIAL_PEN_WIDTH, color: INITIAL_PEN_COLOR });
  const [videoDimensions, setVideoDimensions] = useState<VideoDimensions>(INITIAL_DIMENSIONS); // dimensions of the video element
  const [telestrationHistory, setTelestrationHistory] = useState<InstructionMemory[]>();
  const [backingInstructions, setBackingInstructions] = useState<NAnnotationPoint[]>();

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