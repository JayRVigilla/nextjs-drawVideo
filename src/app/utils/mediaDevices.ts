import { tMediaDevices, tAudioVideoDevices } from "../types/media"

export function getLocalMediaDevices() {
  try {
    // check for media stream
    const stream = getLocalStreams()
    // only continue if there is a stream, else no media devices
    if(stream){
          const sortedDevices = navigator.mediaDevices.enumerateDevices()
            .then(devices => {
              return sortLocalMediaDevices(devices)
            })
            return sortedDevices
          }

    } catch (error: any) {
      console.error(error.message)
  }
}

export function sortLocalMediaDevices(deviceList: MediaDeviceInfo[]) {
  const audio: tAudioVideoDevices = { inputs: [], outputs: [] }
  const video: tAudioVideoDevices = { inputs: [], outputs: [] }

  for (let device of deviceList) {
    if (device.kind.includes('audio')) {
      device.kind.includes('out') ? audio.outputs.push(device) : audio.inputs.push(device)
    } else {
      device.kind.includes('out') ? video.outputs.push(device) : video.inputs.push(device)
    }
  }

  return {audio, video}
}

export function getLocalStreams() {
  try {
    const localStreams = navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(stream => { return stream })
    // console.log("getLocalStreams", localStreams)
    return localStreams
  } catch (error:any) {
  console.error(error.message)
  }
}