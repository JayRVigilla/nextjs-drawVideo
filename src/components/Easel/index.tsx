import { MutableRefObject } from "react";

import clsx from "clsx";

import "./styles.css";

interface EaselProps {
  canvasRef: MutableRefObject<HTMLCanvasElement>;
  show: boolean;
}

export const Easel = () => {

  // allows Participants to receive annotationEvents and see live drawings
  // useTelestrationSubscriptions();

  // converts Host mouse interactions to drawings
  // useMouseEventHandler();

  // send events to PubNub
  // useSendTelestrationEvents();

  return (
    <canvas
      className="root"
    />
  );
};