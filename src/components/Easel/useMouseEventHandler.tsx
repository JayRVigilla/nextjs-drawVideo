import { IPosition, InstructionMemory, NAnnotationPoint, PenStyle, VideoDimensions } from "@/app/types/drawing";
import { useRef, useEffect, useState, SetStateAction, Dispatch, MutableRefObject, SyntheticEvent, useCallback } from "react";
import { INITIAL_PREVIOUS_POINT, MAX_ANNOTATION_POINTS } from "./constants";
import { TwoDimensionPosition } from "@/app/types/drawing";
import { draw, normalizeInstruction } from "@/app/utils/draw";

type tProps = {
  canvasRef: MutableRefObject<HTMLCanvasElement | undefined>
  penStyle: PenStyle;
  videoDimensions: VideoDimensions;
  isDrawModeOn: boolean;
  telestrationHistory: InstructionMemory[];
  // setPenStyle: Dispatch<SetStateAction<PenStyle>>;
  setVideoDimensions: Dispatch<SetStateAction<VideoDimensions>>;
  // setIsDrawModeOn: Dispatch<SetStateAction<boolean>>;
  setTelestrationHistory: Dispatch<SetStateAction<InstructionMemory[]>>;
}

export const useMouseEventHandler = ({
  penStyle,
  // setPenStyle,
    videoDimensions,
    // setVideoDimensions,
    isDrawModeOn = true,
    // setIsDrawModeOn,
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

  const canvas = canvasRef?.current

  const drawLocalAnnotation = useCallback((point: IPosition) => {
    const styles = {
      width: penWidth,
      color: penColor,
    };
    if (!canvas) return
    draw(previousPoint.current, point, styles, canvas);
    const newPreviousPoint = { x: point.x, y: point.y };
    setPreviousPoint(newPreviousPoint);
  },[canvas, penColor, penWidth]);

  const buildAnnotationPointHelper = useCallback((anInstruction: any): void => {
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
    const anInstruction = {
      x: aTouch.offsetX - (videoDimensions.offsetWidth ?? 0),
      y: aTouch.offsetY - (videoDimensions.offsetHeight ?? 0),
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
      /* Retain the last point */
      setBackingInstructions([points[MAX_ANNOTATION_POINTS - 1]]);
    }
  },[buildAnnotationPointHelper, drawLocalAnnotation, videoDimensions]);

  useEffect(() => {
  // add onMouseEvent listeners
      if (!canvas) {
        console.warn(
          "No canvas - Cannot add Telestration mouseEvent listeners"
        );
        return;
      }

  // onMouseDown event
  const onMouseDown = (event: MouseEvent) => {
    /**
     * the default behavior is to either drag and drop or highlight text.
     * preventDefault prevents bug in SOFT-7571 - Telestration Inoperable...
     * */
    event.preventDefault();
    canvas.addEventListener("mousemove", onMouseMove);

    const newPreviousPoint: any = {
      x: event.offsetX - (videoDimensions?.offsetWidth ?? 0),
      y: event.offsetY - (videoDimensions?.offsetHeight ?? 0),
    };
    setPreviousPoint(newPreviousPoint);
    buildAnnotationPointHelper(newPreviousPoint);
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
    /* Always make sure left button is down while moving */
    if (anEvent.buttons === 1) {
      helperForTouchOrMouseEvent(anEvent);
    } else {
      onMouseUp();
    }
  };

  function endLine(){
    canvas?.removeEventListener("mousemove", onMouseMove);
    setPreviousPoint(INITIAL_PREVIOUS_POINT);



    if (backingInstructions.current.length > 0) {
      /* Save the history */
      const newSet: InstructionMemory = {
        instructions: [...backingInstructions.current],
        style: penColor,
      };

      const newHistory = [...telestrationHistory, newSet];
      setTelestrationHistory(newHistory);
      setBackingInstructions([]);
    }
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
    helperForTouchOrMouseEvent,
    setTelestrationHistory
  ]);

};
