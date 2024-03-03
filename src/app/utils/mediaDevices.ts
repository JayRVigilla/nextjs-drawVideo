import {
  BROWSER_AGENTS,
} from "src/domains/Beacon/constants";
import { MediaDevicesInfo } from "src/domains/Beacon/store/stream/types";
import { createObjectClone } from "./objects";
import { isSafari, isFirefox } from "../constants";

export const getLocalVideoStream = async (
  deviceId: string
): Promise<MediaStream | undefined> => {
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { deviceId },
    });
  } catch (error: any) {
    console.error("Error getting local video stream", error?.message)
  }
};

/**
 * returns the device that matches the system default device
 */
const findDefaultDeviceOriginal = (
  devices: MediaDeviceInfo[],
  kind: string
) => {
  const defaultDevice =
    devices.find(
      // in Chrome the default audio device will have deviceID of "default"
      (media) => media.kind === kind && media.deviceId === "default"
      // where there is no "default" deviceId, the system default is heuristically
      // the first index when devices filtered by kind
    ) ?? devices.filter((d) => d.kind === kind)[0];

  const filteredDevices = devices.filter(
    (media) => media.kind === kind && media.deviceId !== "default"
  );

  // find the corresponding device to the current default
  const defaultDeviceOriginal = devices.find(
    (media) =>
      media.kind === kind &&
      media.deviceId !== "default" &&
      media.groupId === defaultDevice.groupId
  );
  // where there is no corresponding device to the default, the system default
  // is heuristically the first index when devices filtered by kind
  return defaultDeviceOriginal ?? filteredDevices[0];
};

// Must get the selected device marked as "default" that comes from the OS audio settings
// in case that the user selects it outside the app
export const getDefaultAudioInputDevice = (devices: MediaDeviceInfo[]) => {
  if (isSameAsSystemEnabled) {
    const defaultDevice = createObjectClone(
      devices.find(
        (media) =>
          media.deviceId.includes("default") && media.kind === "audioinput"
      )
    );
    defaultDevice.label = `Same as system (${defaultDevice.label.replace(
      "Default - ",
      ""
    )})`;
    return defaultDevice;
  } else {
    // return device that matches defaultdevice
    return findDefaultDeviceOriginal(devices, "audioinput");
  }
};

// Filters just the audio inputs (microphones)
export const getAudioInputDevices = (devices: MediaDeviceInfo[]) => {
  const defaultMicrophone = getDefaultAudioInputDevice(devices);

  const audioInputDevices = devices
    .filter(
      (media) =>
        media.kind === "audioinput" &&
        // Must filter the device with default id to remove repetition of device
        !media.deviceId.toLowerCase().includes("default")
    )
    // sort alphabetically by label name for consistent listing order
    .sort((deviceA, deviceB) => {
      return deviceA.label.localeCompare(deviceB.label);
    });

  // if (isSameAsSystemEnabled) {
  //   // default device will always be listed first
  //   return [defaultMicrophone, ...audioInputDevices];
  // } else {
    const defaultDeviceOriginal = findDefaultDeviceOriginal(
      devices,
      "audioinput"
    );
    const defaultDeviceOriginalIndex = audioInputDevices.findIndex(
      (auxInput) => auxInput === defaultDeviceOriginal
    );

    audioInputDevices.splice(defaultDeviceOriginalIndex, 1);
    // default device will always be listed first
    return [defaultDeviceOriginal, ...audioInputDevices];
  // }
};

// We also need the selected output audio device marked as "default" that comes from the OS audio settings
// in case that the user selects it outside the app
export const getDefaultOutputDevice = (devices: MediaDeviceInfo[]) => {
  // if (isSameAsSystemEnabled) {
  //   const defaultDevice = createObjectClone(
  //     devices.find(
  //       (media) =>
  //         media.deviceId.includes("default") && media.kind === "audiooutput"
  //     )
  //   );
  //   defaultDevice.label = `Same as system (${defaultDevice.label.replace(
  //     "Default - ",
  //     ""
  //   )})`;
  //   return defaultDevice;
  // } else {
    // return device that matches defaultdevice
    return findDefaultDeviceOriginal(devices, "audiooutput");
  // }
};

// Filters just the audio outputs (speakers)
export const getAudioOutputDevices = (devices: MediaDeviceInfo[]) => {
  // Safari and Firefox doesn't support changing between the uesr's speakers
  // instead, a static default device is set
  if (isFirefox(navigator.userAgent) || isSafari(navigator.userAgent)) {
    // Any speaker that the user has connected and put as default in its computer
    // that's where the audio will come out
    const defaultAudioOutput: MediaDeviceInfo = {
      deviceId: "default-device",
      groupId: "",
      kind: "audiooutput" as MediaDeviceKind,
      // label: isSameAsSystemEnabled ? "Same as system" : "Default Device",
      label: "Default Device",
      toJSON: () => null,
    };
    return [defaultAudioOutput];
  }

  const audioOutputDevices = devices
    .filter(
      (media) =>
        media.kind === "audiooutput" &&
        // Must filter the device with default id to remove repetition of device
        !media.deviceId.toLowerCase().includes("default")
    )
    // sort alphabetically by label name for consistent listing order
    .sort((deviceA, deviceB) => {
      return deviceA.label.localeCompare(deviceB.label);
    });

  // if (isSameAsSystemEnabled) {
  //   // default device will always be listed first
  //   const defaultSpeaker = getDefaultOutputDevice(devices);
  //   return [defaultSpeaker, ...audioOutputDevices];
  // } else {
    const defaultDeviceMatch = findDefaultDeviceOriginal(
      devices,
      "audiooutput"
    );
    const defaultDeviceMatchIndex = audioOutputDevices.findIndex(
      (auxInput) => auxInput === defaultDeviceMatch
    );

    audioOutputDevices.splice(defaultDeviceMatchIndex, 1);
    // default device will always be listed first
    return [defaultDeviceMatch, ...audioOutputDevices];
  // }
};

// Filters just the video inputs (cameras)
export const getCameraDevices = (devices: MediaDeviceInfo[]) => {
  return devices.filter(
    (media) =>
      media.kind === "videoinput" &&
      media.deviceId !== "default" &&
      media.deviceId !== ""
  );
};

// Stops all the tracks in a stream so the cam/mic turn off in the browser
export const stopMediaTracks = (stream: MediaStream) => {
  try {
    logger().info("Stopping local media stream tracks...");
    const tracks = stream?.getTracks();
    tracks?.forEach((t) => {
      t.enabled = false;
      t.stop();
    });
  } catch (error: any) {
    logger().logWithFields(
      LoggerLevels.error,
      {
        feature: "utils/mediaDevices",
      },
      "Error stopping stream's tracks",
      error?.message
    );
  }
};

// Checks if we have user's devices permissions granted.
export const areDevicesReady = (mediaDevices: MediaDevicesInfo): boolean => {
  const { videoInputs, audioInputs } = mediaDevices;
  return videoInputs.length > 0 && audioInputs.length > 0;
};

// TODO: is this necessary? Or this should be tested with testing-library/react?
// Allows to capture the audio coming from an output device
export const captureMediaStream = (audioEl: HTMLAudioElement): MediaStream => {
  switch (true) {
    case navigator.userAgent.indexOf(BROWSER_AGENTS.Firefox) > -1:
      return (audioEl as any).mozCaptureStream();
    default:
      return (audioEl as any).captureStream();
  }
};

// Must try to re-sync up the local track for video/audio with Twilio using the new device
export const restartLocalTrack = (
  camera: MediaDeviceInfo,
  localTrack: LocalTrack
) => {
  const constraints: MediaTrackConstraints = {
    deviceId: {
      exact: camera.deviceId,
    },
  };

  localTrack
    .stop()
    .restart(constraints)
    .then(() => {
      logger().info(
        `${localTrack.kind} track (${camera.label} successfully changed`
      );
    })
    .catch((reason) => {
      logger().info(
        `${localTrack.kind} track (${camera.label} change rejected. Trying again. ${reason}`
      );
      localTrack
        .restart(constraints)
        .then(() => {
          logger().info(
            `${localTrack.kind} track (${camera.label} successfully changed: Attempt 2`
          );
        })
        .catch((secondAttemptReason) => {
          logger().info(
            `${localTrack.kind} track (${camera.label} change rejected again. ${secondAttemptReason}`
          );
        });
    });
};
