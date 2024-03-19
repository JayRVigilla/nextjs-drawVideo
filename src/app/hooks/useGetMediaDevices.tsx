// hooks, must use client
'use client'
import { useEffect, useState } from "react"
import { tMediaDevices, tAudioVideoDevices, tLocalMediaTracks } from "../types/media"
import { getLocalMediaDevices, getLocalStreams } from "../utils/mediaDevices"

const INITIAL_MEDIA_DEVICES: tMediaDevices = {
  audio:{inputs:[], outputs:[]},
  video:{inputs:[], outputs:[]}
}


export const useAVMediaDevices = () => {

  const [mediaDevices, setMediaDevices] = useState(INITIAL_MEDIA_DEVICES)
  const [streams, setStreams] = useState<MediaStream | undefined>(undefined)
  const [mediaTracks, setMediaTracks] = useState<tLocalMediaTracks | undefined>(undefined)


  const setAudioDevices = (audioDevices: tAudioVideoDevices) => {
    setMediaDevices({ video: mediaDevices.video, audio: audioDevices })
  }
  const setVideoDevices = (videoDevices: tAudioVideoDevices) => {
    setMediaDevices({audio: mediaDevices.audio, video: videoDevices})
  }

  // const stopTracks = ({audio, video}: {audio: boolean, video: boolean}) => {
  //   const streamsCopy = mediaTracks ? [...mediaTracks] : []
  //   streamsCopy.forEach(track => {
  //     if (track.enabled) {
  //       const stopTrack = audio && track.kind === 'audio' || video && track.kind === 'video'
  //       if (stopTrack) {
  //         track.enabled = false
  //         track.stop()
  //       }
  //     }
  //   })
  //   setMediaTracks(streamsCopy)
  //   console.log("STOPPED TRACKS")
  // }

  useEffect(() => {
    // get the local A/V media devices and set to state
    const initMediaDevices = async () => {
      const sortedDevices = await getLocalMediaDevices()
      if(sortedDevices) setMediaDevices(sortedDevices)
    }

    initMediaDevices()
  }, [])

  useEffect(() => {
    const initStreams = async () => {
      const localStreams = await getLocalStreams()
      if (localStreams) {
        setStreams(localStreams)
        const tracks = localStreams?.getTracks()
        setMediaTracks({audio: [tracks[0]], video: [tracks[1]]})
      }
    }
    initStreams()
  }, [])

  return {
    mediaDevices,
    // setMediaDevices,
    // setAudioDevices,
    // setVideoDevices,
    streams,
    // setStreams,
    mediaTracks,
    // stopTracks
  }
}