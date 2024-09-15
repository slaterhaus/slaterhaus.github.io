"use client";
import React, {useCallback, useState} from 'react';
import WebcamRecorder from "@/components/multi-track-video/webcam-recorder";
import MultiTileScreen from "@/components/multi-track-video/multi-tile-screen";

const Page = (callback: T, deps: React.DependencyList) => {
    const [recordings, setRecordings] = useState<Blob[]>([]);

    const handleRecordingComplete = (recording: Blob) => {
        console.log({recording})
        setRecordings([...recordings, recording]);
    };
    const reset = useCallback(() => {
        setRecordings([]);
    }, deps)

    return (
        <div>
            <h1>Webcam Recording App</h1>
            <button>Reset All</button>
            <WebcamRecorder onRecordingComplete={handleRecordingComplete} />
            <MultiTileScreen recordings={recordings} />
        </div>
    );
};

export default Page;