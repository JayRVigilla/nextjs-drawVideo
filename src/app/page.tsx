// uses a hook, has to be client
'use client'

import "./pageStyles.css";
import { useAVMediaDevices } from "./hooks/useGetMediaDevices";

export default function Home() {

  const { mediaDevices, stopTracks } = useAVMediaDevices()



  return (
    <main className=".root">
      <h1>Home</h1>
      <button onClick={() => stopTracks({audio: true, video: true})}>Click</button>
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
