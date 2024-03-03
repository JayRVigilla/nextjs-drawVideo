/** Video documentation
 */
import React, { useEffect, useState } from "react";

import clsx from "clsx";

import "./styles.css";

export interface VideoProps {
  "data-test-id"?: string;
}

export const Video = () => {
  // * hooks
  // const hook = () => {};
  // * state
  // const [something, useSomething] = useState(undefined);

  // * useEffects
  // useEffect(() => {
  // first
  // return ({}: VideoProps) => {
  // second
  // }
  // }, [third])

  return (
    <div className="root video-container">
      <video className="video-stream">Video</video>
    </div>
  );
};
