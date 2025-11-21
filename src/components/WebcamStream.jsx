import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";

const WebcamStream = ({ onFrame, isPaused }) => {
    const webcamRef = useRef(null);

    useEffect(() => {
        if (isPaused) {
            return;
        } else {
            const interval = setInterval(async () => {
                if (!webcamRef.current) return;
                const imageSrc = webcamRef.current.getScreenshot();
                if (!imageSrc) return;

                const blob = await (await fetch(imageSrc)).blob();
                onFrame(blob); 
            }, 500);

            return () => clearInterval(interval);
        }

    }, [onFrame, isPaused]);

    return (
        <div className="webcam-container">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                mirrored
                width={640}
                height={480}
            />
        </div>
    );
};

export default WebcamStream;
