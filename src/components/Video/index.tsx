/** Video documentation
 */
import React, { useEffect, useState, MutableRefObject } from "react";

import clsx from "clsx";

import "./styles.css";
import { useVideoStream } from "@/app/hooks/useVideoStream";

export interface VideoProps {
  "data-test-id"?: string;
  id?: string;
  stream: MediaStream;
  videoRef: MutableRefObject<HTMLVideoElement>;
}

export const Video = ({id="default",stream, videoRef}: VideoProps) => {
  // * hooks
  // const hook = () => {};
  // * state
  // const [something, useSomething] = useState(undefined);
  // const videoRef = useRef()
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play()
      console.log(`Attached ${stream.id} to ${videoRef.current}` )
    }

  }, [stream, videoRef])

  return (
    <div className="root video-container">
      <video className="video-stream" id={id} ref={videoRef}>Video</video>
    </div>
  );
};
