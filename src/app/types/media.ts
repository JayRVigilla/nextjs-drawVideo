export type tAudioVideoDevices = {
  inputs: MediaDeviceInfo[];
  outputs: MediaDeviceInfo[];
}

export type tMediaDevices = {
  audio: tAudioVideoDevices;
  video: tAudioVideoDevices;
}

