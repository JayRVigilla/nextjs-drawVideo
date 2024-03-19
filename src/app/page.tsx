// uses a hook, has to be client
'use client'

import "./pageStyles.css";
import { useAVMediaDevices } from "./hooks/useGetMediaDevices";
import { Video } from "@/components/Video";
import { Easel } from "@/components/Easel";
export default function Home() {

  const { mediaDevices, streams, mediaTracks } = useAVMediaDevices()
  // TODO:
  // - bring in Easel & drawTools
  // - lay Easel over Video in a new component
  return (
    <main className="main">
      <h1>Video</h1>
      <div className="easel-container">
      <Easel />
      {streams && <Video stream={streams} />}
      </div>

    </main>
  );
}
