"use client";
import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';

interface WebcamRecorderProps {
    onRecordingComplete: (recordingBlob: Blob) => void;
}

const WebcamRecorder = ({ onRecordingComplete }: WebcamRecorderProps) => {
    const webcamRef = useRef<Webcam>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

    const handleDataAvailable = useCallback(
        ({ data }: { data: Blob }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => [...prev, data]);
            }
        },
        []
    );

    const handleStartCaptureClick = useCallback(() => {
        if (!webcamRef.current?.stream) {
            console.error("No webcam stream available");
            return;
        }
        setCapturing(true);
        setRecordedChunks([]);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm"
        });
        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
        mediaRecorderRef.current.start();
    }, [webcamRef, handleDataAvailable]);

    const handleStopCaptureClick = useCallback(() => {
        if (!mediaRecorderRef.current) {
            console.error("No MediaRecorder to stop");
            return;
        }
        mediaRecorderRef.current.stop();
        setCapturing(false);
    }, [mediaRecorderRef]);

    useEffect(() => {
        if (!capturing && recordedChunks.length > 0) {
            const blob = new Blob(recordedChunks, { type: "video/webm" });
            console.log(blob)
            onRecordingComplete(blob);
            setRecordedChunks([]);
        }
    }, [capturing, recordedChunks, onRecordingComplete]);

    return (
        <div>
            <Webcam audio={true} ref={webcamRef} muted={true}/>
            {capturing ? (
                <button onClick={handleStopCaptureClick}>Stop Capture</button>
            ) : (
                <button onClick={handleStartCaptureClick}>Start Capture</button>
            )}
        </div>
    );
};

export default WebcamRecorder;