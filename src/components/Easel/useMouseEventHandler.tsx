import { IPosition, InstructionMemory, NAnnotationPoint, PenStyle, VideoDimensions } from "@/app/types/drawing";
import { useRef, useEffect, useState, SetStateAction, Dispatch, MutableRefObject, SyntheticEvent } from "react";
import { INITIAL_PREVIOUS_POINT, MAX_ANNOTATION_POINTS } from "./constants";
import { TwoDimensionPosition } from "@/app/types/drawing";
import { draw, normalizeInstruction } from "@/app/utils/draw";

type tProps = {
  canvasRef: MutableRefObject<HTMLCanvasElement>
  penStyle: PenStyle;
  videoDimensions: VideoDimensions;
  isDrawModeOn: boolean;
  telestrationHistory: InstructionMemory;
  setPenStyle: Dispatch<SetStateAction<PenStyle>>;
  setVideoDimensions: Dispatch<SetStateAction<VideoDimensions>>;
  setIsDrawModeOn: Dispatch<SetStateAction<boolean>>;
  setTelestrationHistory: Dispatch<SetStateAction<InstructionMemory>>;
}

export const useMouseEventHandler = ({
  penStyle,
  setPenStyle,
    videoDimensions,
    setVideoDimensions,
    isDrawModeOn,
    setIsDrawModeOn,
    telestrationHistory,
  setTelestrationHistory,
    canvasRef
}: tProps) => {

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

  const canvas = canvasRef?.current
  // const isAllowedToDraw =
  //   !refreshInProgress && canvas && isHostUser && isDrawModeOn;

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

    const newPreviousPoint: any = {
      x: event.pageX - (videoDimensions?.offsetWidth ?? 0),
      y: event.pageY - (videoDimensions?.offsetHeight ?? 0),
    };
    setPreviousPoint(newPreviousPoint);
    buildAnnotationPointHelper(newPreviousPoint);
    // dispatch(telestrationActions.setSendEvent({ type: "START" }));
  };

  const drawLocalAnnotation = (point: IPosition) => {
    const styles = {
      width: penWidth,
      color: penColor,
    };
    draw(previousPoint.current, point, styles, canvasRef);

    const newPreviousPoint = { x: point.x, y: point.y };
    setPreviousPoint(newPreviousPoint);
  };

  const buildAnnotationPointHelper = (anInstruction: any): void => {
    const aPoint: NAnnotationPoint = normalizeInstruction(
      anInstruction,
      videoDimensions,
      penWidth
    );
    const backingInstructionsCopy: NAnnotationPoint[] =
      backingInstructions.current;
    setBackingInstructions([...backingInstructionsCopy, aPoint]);
  };

  const helperForTouchOrMouseEvent = (aTouch: any) => {
    const anInstruction = {
      x: aTouch.pageX - (videoDimensions.offsetWidth ?? 0),
      y: aTouch.pageY - (videoDimensions.offsetHeight ?? 0),
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
      dispatch(
        telestrationActions.setSendEvent({
          type: "ANNOTATION",
          payload: points,
        })
      );
      /* Retain the last point */
      setBackingInstructions([points[MAX_ANNOTATION_POINTS - 1]]);
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

    /* Always make sure left button is down while moving */
    if (anEvent.buttons === 1) {
      helperForTouchOrMouseEvent(anEvent);
    } else {
      onMouseUp();
    }
  };

  const endLine = () => {
    // if (!isAllowedToDraw) {
    //   // only the Host get to draw
    //   return;
    // }
    canvas.removeEventListener("mousemove", onMouseMove);

    setPreviousPoint(INITIAL_PREVIOUS_POINT);
    if (backingInstructions.current.length > 0) {
      dispatch(
        telestrationActions.setSendEvent({
          type: "ANNOTATION",
          payload: backingInstructions.current,
        })
      );
      setBackingInstructions([]);
    }
    dispatch(telestrationActions.setSendEvent({ type: "END" }));
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

  // add onMouseEvent listeners
  useEffect(() => {
    if (!canvas || !isDrawModeOn) {
      if (!canvas) {
        console.log(
          "No canvas - Cannot add Telestration mouseEvent listeners"
        );
        // logger().info(
        //   "No canvas - Cannot add Telestration mouseEvent listeners"
        // );
      }
      return;
    }
    console.log(`Updating Telestration onMouseEvent listeners`);
    // logger().info(`Updating Telestration onMouseEvent listeners`);

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
    onMouseDown,
    onMouseLeave,
    onMouseUp
    // isAllowedToDraw,
  ]);
};
