'use client'
import { useEffect, MutableRefObject } from 'react'

type tProps = {
  stream: MediaStream;
  videoRef: MutableRefObject<HTMLVideoElement>;
}

export const useVideoStream = ({stream, videoRef}: tProps) => {

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
      console.log(`Attached ${stream} to ${videoRef.current}` )
    }

  }, [stream, videoRef])

}