/** Video documentation
 */
import React, { useEffect, useRef, MutableRefObject } from "react";

import clsx from "clsx";

import "./styles.css";
import { useVideoStream } from "@/app/hooks/useVideoStream";

export interface VideoProps {
  "data-test-id"?: string;
  id?: string;
  stream: MediaStream;
  // videoRef: MutableRefObject<HTMLVideoElement>;
}

export const Video = ({ id = "default", stream }: VideoProps) => {
  const videoRef = useRef() as MutableRefObject<HTMLVideoElement>
  useEffect(() => {
    // attaching the stream to the video element
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play()
      console.log(`Attached ${stream.id} to videoElement#${id}` )
    }

  }, [stream, videoRef, id])

  return (
    <div className="root video-container">
      <video className="video-stream" id={id} ref={videoRef}>Video</video>
    </div>
  );
};
