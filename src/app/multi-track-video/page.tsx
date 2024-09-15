"use client";
import React, {useCallback, useState} from 'react';
import WebcamRecorder from "@/components/multi-track-video/webcam-recorder";
import MultiTileScreen from "@/components/multi-track-video/multi-tile-screen";

const Page = () => {
    const [recordings, setRecordings] = useState<Blob[]>([]);

    const handleRecordingComplete = (recording: Blob) => {
        setRecordings([...recordings, recording]);
    };
    const reset = useCallback(() => {
        setRecordings([]);
    }, [setRecordings])

    return (
        <div>
            <h1>Webcam Recording App</h1>
            <button onClick={reset}>Reset All</button>
            <WebcamRecorder onRecordingComplete={handleRecordingComplete} />
            <MultiTileScreen recordings={recordings} />
        </div>
    );
};

export default Page;