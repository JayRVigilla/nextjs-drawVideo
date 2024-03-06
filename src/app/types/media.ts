export type tAudioVideoDevices = {
  inputs: MediaDeviceInfo[];
  outputs: MediaDeviceInfo[];
}

export type tMediaDevices = {
  audio: tAudioVideoDevices;
  video: tAudioVideoDevices;
}

export type tLocalMediaTracks = {
  audio: MediaStreamTrack[];
  video: MediaStreamTrack[];
}