'use client'
import Image from "next/image";
import styles from "./page.module.css";

type tMediaDevices = {
  inputs: MediaDeviceInfo[];
  outputs: MediaDeviceInfo[];
}

export default function Home() {
const getMediaStreamDevices = async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      // console.table(media)
      if (media) {
        const devices = await navigator.mediaDevices.enumerateDevices()
          const audio: tMediaDevices = { inputs: [], outputs: [] }
          const video: tMediaDevices = { inputs: [], outputs: [] }
        for (let device of devices) {
          if (device.kind.includes('audio')) {
            device.kind.includes('out') ? audio.outputs.push(device) : audio.inputs.push(device)
          } else {
            device.kind.includes('out') ? video.outputs.push(device) : video.inputs.push(device)
          }
        }

        // return devices
        return {audio, video}
      }
    } catch (error: any) {
      console.error(error.message)
  }
  }

  const devices = getMediaStreamDevices()
  console.log("**devices**", devices)


  return (
    <main className={styles.main}>
      <h1>Home</h1>
    </main>
  );
}
