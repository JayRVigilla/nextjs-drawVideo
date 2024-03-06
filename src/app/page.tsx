// uses a hook, has to be client
'use client'

import "./pageStyles.css";
import { useAVMediaDevices } from "./hooks/useGetMediaDevices";
import { MutableRefObject, useRef } from "react";
import { Video } from "@/components/Video";
export default function Home() {

//   const { mediaDevices, stopTracks, streams, mediaTracks } = useAVMediaDevices()
// console.log("page", { mediaDevices, stopTracks, streams, mediaTracks })
  const { mediaDevices, streams, mediaTracks } = useAVMediaDevices()
// console.log("page", { mediaDevices, streams, mediaTracks })
const videoRef = useRef() as MutableRefObject<HTMLVideoElement>

  return (
    <main className=".root">
      <h1>Video</h1>

      {/* <button onClick={() => stopTracks({ audio: true, video: true })}>Click</button> */}
      {streams && <Video stream={streams} videoRef={videoRef} />}
      <ul> Audio In
        {mediaDevices?.audio?.inputs?.map((device) => {
          return (
            <li
              key={`${device.deviceId}`}>
              {device.label}
            </li>
          )
      })}
      </ul>

      <ul> Audio Out
        {mediaDevices?.audio?.outputs?.map((device) => {
          return (
            <li
              key={`${device.deviceId}`}>
              {device.label}
            </li>
          )
      })}
      </ul>

      <ul> Video In
        {mediaDevices?.video?.inputs?.map((device) => {
          return (
            <li
              key={`${device.deviceId}`}>
              {device.label}
            </li>
          )
      })}
      </ul>
      <ul> Video Out
        {mediaDevices?.video?.outputs?.map((device) => {
          return (
            <li
              key={`${device.deviceId}`}>
              {device.label}
            </li>
          )
      })}
      </ul>
    </main>
  );
}
