/** Video documentation
 */
import React, { useEffect, useRef, MutableRefObject } from "react";
import "./styles.css";

export interface VideoProps {
  "data-test-id"?: string;
  id?: string;
  stream: MediaStream;
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

  /**
 * TODO
 * stop()
 * refresh()/reattach()
 * notVisisble()
 * detach(): should also turnoff indicator light if local input
 */


  return (
    <div className="root video-container">
      <video className="video-stream" id={id} ref={videoRef}>Video</video>
    </div>
  );
};
