import { IPosition, InstructionMemory, NAnnotationPoint, PenStyle, VideoDimensions } from "@/app/types/drawing";
import { useRef, useEffect, useState, SetStateAction, Dispatch, MutableRefObject, SyntheticEvent, useCallback } from "react";
import { INITIAL_PREVIOUS_POINT, MAX_ANNOTATION_POINTS } from "./constants";
import { TwoDimensionPosition } from "@/app/types/drawing";
import { draw, getParentDimensions, normalizeInstruction } from "@/app/utils/draw";

type tProps = {
  canvasRef: MutableRefObject<HTMLCanvasElement | undefined>
  penStyle: PenStyle;
  videoDimensions: VideoDimensions;
  isDrawModeOn: boolean;
  telestrationHistory: InstructionMemory[];
  // telestrationHistory: InstructionMemory;
  setPenStyle: Dispatch<SetStateAction<PenStyle>>;
  setVideoDimensions: Dispatch<SetStateAction<VideoDimensions>>;
  setIsDrawModeOn: Dispatch<SetStateAction<boolean>>;
  // setTelestrationHistory: Dispatch<SetStateAction<InstructionMemory>>;
}

export const useMouseEventHandler = ({
  penStyle,
  setPenStyle,
    videoDimensions,
    setVideoDimensions,
    isDrawModeOn = true,
    setIsDrawModeOn,
    telestrationHistory,
  // setTelestrationHistory,
    canvasRef
}: tProps) => {
// console.log('%c * useMouseEventHandler - videoDimensions ', 'color: orange; background-color: transparent; font-weight: 800; font-style: italic;', {videoDimensions})
  const { color: penColor, width: penWidth } = penStyle

  const [_previousPoint, _setPreviousPoint] = useState<TwoDimensionPosition>(
    INITIAL_PREVIOUS_POINT
  );
  const previousPoint = useRef(_previousPoint);

  const setPreviousPoint = (data : TwoDimensionPosition) => {
    previousPoint.current = data;
    _setPreviousPoint(data);
  };

  const [_backingInstructions, _setBackingInstructions] = useState<NAnnotationPoint[]>([]);
  const backingInstructions = useRef(_backingInstructions);
  const setBackingInstructions = (data: NAnnotationPoint[]) => {
    backingInstructions.current = data;
    _setBackingInstructions(data);
  };
  // const refreshInProgress = useAppSelector(selectTriggerRefreshFrames);
  // if(!canvasRef.current) return
  const canvas = canvasRef?.current

  // if (canvasRef?.current && !videoDimensions) {
  //   const parentDimensions = getParentDimensions(canvasRef?.current)
  //   setVideoDimensions(parentDimensions)
  // }
  // const isAllowedToDraw =
  //   !refreshInProgress && canvas && isHostUser && isDrawModeOn;

  // // onMouseDown event
  // const onMouseDown = (event: MouseEvent) => {
  //   // if (!isAllowedToDraw) {
  //   //   return;
  //   // }

  //   /**
  //    * the default behavior is to either drag and drop or highlight text.
  //    * preventDefault prevents bug in SOFT-7571 - Telestration Inoperable...
  //    * */
  //   event.preventDefault();

  //   canvas.addEventListener("mousemove", onMouseMove);

  //   const newPreviousPoint: any = {
  //     x: event.pageX - (videoDimensions?.offsetWidth ?? 0),
  //     y: event.pageY - (videoDimensions?.offsetHeight ?? 0),
  //   };
  //   setPreviousPoint(newPreviousPoint);
  //   buildAnnotationPointHelper(newPreviousPoint);
  //   // dispatch(telestrationActions.setSendEvent({ type: "START" }));
  // };

  const drawLocalAnnotation = useCallback((point: IPosition) => {
    const styles = {
      width: penWidth,
      color: penColor,
    };
    if (!canvas) return
    // console.log("drawLocalAnnotation",{point, styles})
    draw(previousPoint.current, point, styles, canvas);
console.log('%c * drawLocalAnnotation - videoDimensions ', 'color: pink; background-color: transparent; font-weight: 800; font-style: italic;', {videoDimensions, point, styles})
    const newPreviousPoint = { x: point.x, y: point.y };
    setPreviousPoint(newPreviousPoint);
  },[canvas, penColor, penWidth, videoDimensions]);

  const buildAnnotationPointHelper = useCallback((anInstruction: any): void => {
    console.log('%c * buildAnnotationPointHelper - videoDimensions, anInstruction ', 'color: green; background-color: transparent; font-weight: 800; font-style: italic;', {videoDimensions, anInstruction})
    const aPoint: NAnnotationPoint = normalizeInstruction(
      anInstruction,
      videoDimensions,
      penWidth
    );
    const backingInstructionsCopy: NAnnotationPoint[] =
      backingInstructions.current;
    setBackingInstructions([...backingInstructionsCopy, aPoint]);
  },[penWidth, videoDimensions]);

  const helperForTouchOrMouseEvent = useCallback((aTouch: any) => {
    console.log("helperForTouchOrMouseEvent", aTouch)
    const anInstruction = {
      x: aTouch.offsetX - (videoDimensions.offsetWidth ?? 0),
      // x: aTouch.pageX - (videoDimensions.offsetWidth ?? 0),
      y: aTouch.offsetY - (videoDimensions.offsetHeight ?? 0),
      // y: aTouch.pageY - (videoDimensions.offsetHeight ?? 0),
    };

    drawLocalAnnotation(anInstruction);

    if (aTouch.pageX && aTouch.pageY) {
      buildAnnotationPointHelper(anInstruction);
    }

    const backingInstructionsCopy = [
      ...backingInstructions.current,
    ] as NAnnotationPoint[];
    if (backingInstructionsCopy.length === MAX_ANNOTATION_POINTS) {
      const points: NAnnotationPoint[] = backingInstructionsCopy.splice(
        0,
        MAX_ANNOTATION_POINTS
      );
      // dispatch(
      //   telestrationActions.setSendEvent({
      //     type: "ANNOTATION",
      //     payload: points,
      //   })
      // );
      /* Retain the last point */
      setBackingInstructions([points[MAX_ANNOTATION_POINTS - 1]]);
    }
  },[buildAnnotationPointHelper, drawLocalAnnotation, videoDimensions]);

  // // onMouseMove event
  // const onMouseMove = (moveEvent: Event): void => {
  //   const anEvent: React.MouseEvent<
  //     HTMLCanvasElement,
  //     MouseEvent
  //   > = (moveEvent as unknown) as React.MouseEvent<
  //     HTMLCanvasElement,
  //     MouseEvent
  //   >;
  //   // if (!isAllowedToDraw) {
  //   //   // only the Host get to draw
  //   //   return;
  //   // }

  //   /* Always make sure left button is down while moving */
  //   if (anEvent.buttons === 1) {
  //     helperForTouchOrMouseEvent(anEvent);
  //   } else {
  //     onMouseUp();
  //   }
  // };

  // function endLine(){
  //   // if (!isAllowedToDraw) {
  //   //   // only the Host get to draw
  //   //   return;
  //   // }
  //   canvas.removeEventListener("mousemove", onMouseMove);

  //   setPreviousPoint(INITIAL_PREVIOUS_POINT);
  //   if (backingInstructions.current.length > 0) {
  //     // dispatch(
  //     //   telestrationActions.setSendEvent({
  //     //     type: "ANNOTATION",
  //     //     payload: backingInstructions.current,
  //     //   })
  //     // );
  //     setBackingInstructions([]);
  //   }
  //   // dispatch(telestrationActions.setSendEvent({ type: "END" }));
  // };

  // // onMouseUp event
  // const onMouseUp = (): void => {
  //   endLine();
  // };

  // const onMouseLeave = (event: MouseEvent) => {
  //   // only end line and send endEvent if drawing
  //   if (event.buttons === 1) {
  //     endLine();
  //   }
  // };

  useEffect(() => {
  // add onMouseEvent listeners
    // if (!canvas || !isDrawModeOn) {
      if (!canvas) {
        console.warn(
          "No canvas - Cannot add Telestration mouseEvent listeners"
        );
        // logger().info(
        //   "No canvas - Cannot add Telestration mouseEvent listeners"
        // );
        return;
      }
    // }
    console.log(`Updating Telestration onMouseEvent listeners`, videoDimensions);
    // logger().info(`Updating Telestration onMouseEvent listeners`);

  // onMouseDown event
  const onMouseDown = (event: MouseEvent) => {
    // if (!isAllowedToDraw) {
    //   return;
    // }
    /**
     * the default behavior is to either drag and drop or highlight text.
     * preventDefault prevents bug in SOFT-7571 - Telestration Inoperable...
     * */
    event.preventDefault();

    canvas.addEventListener("mousemove", onMouseMove);

    // const newPreviousPoint: any = {
    //   x: event.pageX,
    //   y: event.pageY,
    // };
console.log('%c * onMouseDown - event ', 'color: gold; background-color: transparent; font-weight: 800; font-style: italic;', {event})
    const newPreviousPoint: any = {
      x: event.offsetX - (videoDimensions?.offsetWidth ?? 0),
      y: event.offsetY - (videoDimensions?.offsetHeight ?? 0),
      // x: event.pageX - (videoDimensions?.offsetWidth ?? 0),
      // y: event.pageY - (videoDimensions?.offsetHeight ?? 0),
    };
    console.log("mousedown", newPreviousPoint)
    setPreviousPoint(newPreviousPoint);
    buildAnnotationPointHelper(newPreviousPoint);
    // dispatch(telestrationActions.setSendEvent({ type: "START" }));
  };

  // onMouseUp event
  const onMouseUp = (): void => {
    endLine();
  };

    const onMouseLeave = (event: MouseEvent) => {
    // only end line and send endEvent if drawing
    if (event.buttons === 1) {
      endLine();
    }
  };

      // onMouseMove event
  const onMouseMove = (moveEvent: Event): void => {
    const anEvent: React.MouseEvent<
      HTMLCanvasElement,
      MouseEvent
    > = (moveEvent as unknown) as React.MouseEvent<
      HTMLCanvasElement,
      MouseEvent
    >;
    // if (!isAllowedToDraw) {
    //   // only the Host get to draw
    //   return;
    // }
    console.log("onMouseMove", anEvent)
    /* Always make sure left button is down while moving */
    if (anEvent.buttons === 1) {
      helperForTouchOrMouseEvent(anEvent);
    } else {
      onMouseUp();
    }
  };

      function endLine(){
    // if (!isAllowedToDraw) {
    //   // only the Host get to draw
    //   return;
    // }
    canvas?.removeEventListener("mousemove", onMouseMove);

    setPreviousPoint(INITIAL_PREVIOUS_POINT);
    if (backingInstructions.current.length > 0) {
      // dispatch(
      //   telestrationActions.setSendEvent({
      //     type: "ANNOTATION",
      //     payload: backingInstructions.current,
      //   })
      // );
      setBackingInstructions([]);
    }
    // dispatch(telestrationActions.setSendEvent({ type: "END" }));
  };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);
    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [
    canvas,
    isDrawModeOn,
    penColor,
    videoDimensions,
    penWidth,
    telestrationHistory,
    buildAnnotationPointHelper,
    helperForTouchOrMouseEvent
  ]);

    useEffect(() => {
    /**
     * Listening to the video element resize in order to redraw Telestration.
     * Using the ResizeObserver API instead of useEventListener since using
     * videoDimensions as a dependency is unreliable for real-time
     * resize events.
     * https:// developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
     */
    console.log('%c * new useEffect', 'color: orange; background-color: transparent; font-weight: 800; font-style: italic;')
    if (canvasRef?.current?.parentElement) {
        console.log('%c * IF new useEffect', 'color: orange; background-color: transparent; font-weight: 800; font-style: italic;')
        const resizeObserver = new ResizeObserver((entries) => {
          console.log('%c * resize - entries ', 'color: #3366CC; background-color: transparent; font-weight: 800; font-style: italic;', { entries })
          const {width, height} = entries[0].contentRect
          setVideoDimensions({...videoDimensions, width, height})
        })
        resizeObserver.observe(canvasRef.current.parentElement)
      }
    }, [canvasRef]);

};
