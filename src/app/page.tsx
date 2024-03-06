// uses a hook, has to be client
'use client'

import "./pageStyles.css";
import { useAVMediaDevices } from "./hooks/useGetMediaDevices";
import { Video } from "@/components/Video";
export default function Home() {

  const { mediaDevices, streams, mediaTracks } = useAVMediaDevices()

  return (
    <main className=".root">
      <h1>Video</h1>
      {streams && <Video stream={streams} />}
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
