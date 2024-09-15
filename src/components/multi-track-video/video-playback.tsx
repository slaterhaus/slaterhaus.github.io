"use client";
import React, { useState, useRef, useEffect } from 'react';

interface VideoPlaybackProps {
    videoBlob: Blob;
}

const VideoPlayback = ({ videoBlob }: VideoPlaybackProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [startTime, setStartTime] = useState<number>(0);
    const [endTime, setEndTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (videoBlob instanceof Blob) {
            try {
                const url = URL.createObjectURL(videoBlob);
                setVideoUrl(url);
            } catch (e) {
                console.error("Error creating object URL:", e);
            }
        } else {
            console.error("Invalid videoBlob provided");
        }
    }, [videoBlob]);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            const handleDurationChange = () => {
                if (isFinite(videoElement.duration) && videoElement.duration > 0) {
                    console.log("Duration changed:", videoElement.duration);
                    setDuration(videoElement.duration);
                    setEndTime(videoElement.duration);
                }
            };

            const handleLoadedData = () => {
                if (isFinite(videoElement.duration) && videoElement.duration > 0) {
                    setDuration(videoElement.duration);
                    setEndTime(videoElement.duration);
                } else {
                    // If duration is not available, start polling
                    const checkDuration = setInterval(() => {
                        if (isFinite(videoElement.duration) && videoElement.duration > 0) {
                            setDuration(videoElement.duration);
                            setEndTime(videoElement.duration);
                            clearInterval(checkDuration);
                        }
                    }, 100);

                    // Clear interval after 10 seconds to prevent infinite polling
                    setTimeout(() => clearInterval(checkDuration), 10000);
                }
            };

            videoElement.addEventListener('durationchange', handleDurationChange);
            videoElement.addEventListener('loadeddata', handleLoadedData);

            return () => {
                videoElement.removeEventListener('durationchange', handleDurationChange);
                videoElement.removeEventListener('loadeddata', handleLoadedData);
            };
        }
    }, [videoUrl]);

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartTime(parseFloat(e.target.value));
    };

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndTime(parseFloat(e.target.value));
    };

    const handlePlay = () => {
        if (!videoRef.current) return;
        videoRef.current.currentTime = startTime;
        videoRef.current.play();
        setTimeout(() => {
            if (!videoRef.current) return;
            videoRef.current.pause();
        }, (endTime - startTime) * 1000);
    };


    return (
        <div>
            <video ref={videoRef} src={videoUrl || ''} preload="metadata"/>
            <div>
                <label>
                    Start Time:
                    <input
                        type="range"
                        min={0}
                        max={duration}
                        step={0.1}
                        value={startTime}
                        onChange={handleStartTimeChange}
                    />
                    {startTime.toFixed(1)}s
                </label>
            </div>
            <div>
                <label>
                    End Time:
                    <input
                        type="range"
                        min={0}
                        max={duration}
                        step={0.1}
                        value={endTime}
                        onChange={handleEndTimeChange}
                    />
                    {endTime.toFixed(1)}s
                </label>
            </div>
            <button onClick={handlePlay}>Play Selected Range</button>
        </div>
    );
};

export default VideoPlayback;