"use client";
import React, { useState, useRef, useEffect } from 'react';
import styles from './multi-tile-screen.module.scss';

interface VideoPlaybackProps {
    videoBlob: Blob;
    isPlaying?: boolean;
    currentTime?: number;
    isLoop?: boolean;
    onPlayStateChange?: (playing: boolean) => void;
    onTimeUpdate?: (time: number) => void;
    onToggleLoop?: () => void;
    onDelete?: () => void;
    trackNumber?: number;
    hideControls?: boolean;
}

const VideoPlayback = ({
    videoBlob,
    isPlaying = false,
    currentTime = 0,
    isLoop = false,
    onPlayStateChange,
    onTimeUpdate,
    onToggleLoop,
    onDelete,
    trackNumber,
    hideControls = false
}: VideoPlaybackProps) => {
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

            const handleTimeUpdate = () => {
                if (onTimeUpdate) {
                    onTimeUpdate(videoElement.currentTime);
                }
            };

            videoElement.addEventListener('durationchange', handleDurationChange);
            videoElement.addEventListener('loadeddata', handleLoadedData);
            videoElement.addEventListener('timeupdate', handleTimeUpdate);

            return () => {
                videoElement.removeEventListener('durationchange', handleDurationChange);
                videoElement.removeEventListener('loadeddata', handleLoadedData);
                videoElement.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }
    }, [videoUrl, onTimeUpdate]);

    // Sync playback with parent component
    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            if (isPlaying && videoElement.paused) {
                videoElement.play().catch(err => console.error("Error playing video:", err));
            } else if (!isPlaying && !videoElement.paused) {
                videoElement.pause();
            }
        }
    }, [isPlaying]);

    // Sync current time with parent component
    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement && Math.abs(videoElement.currentTime - currentTime) > 0.5) {
            videoElement.currentTime = currentTime;
        }
    }, [currentTime]);

    // Handle loop setting
    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.loop = isLoop;
        }
    }, [isLoop]);

    // Ensure video plays when it's supposed to be playing (fixes presentation mode issue)
    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement && isPlaying) {
            const playVideo = async () => {
                try {
                    // Set the current time first
                    if (Math.abs(videoElement.currentTime - currentTime) > 0.5) {
                        videoElement.currentTime = currentTime;
                    }

                    // Wait for the video to be ready
                    if (videoElement.readyState < 2) {
                        await new Promise((resolve) => {
                            const onCanPlay = () => {
                                videoElement.removeEventListener('canplay', onCanPlay);
                                resolve(undefined);
                            };
                            videoElement.addEventListener('canplay', onCanPlay);
                        });
                    }

                    // Now play the video
                    if (videoElement.paused) {
                        await videoElement.play();
                    }
                } catch (err) {
                    console.error("Error playing video:", err);
                }
            };
            playVideo();
        }
    }, [videoUrl, isPlaying, currentTime]);

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartTime(parseFloat(e.target.value));
    };

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndTime(parseFloat(e.target.value));
    };

    const handlePlay = () => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        video.currentTime = startTime;

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Auto-pause when reaching end time
                const checkTime = () => {
                    if (video.currentTime >= endTime) {
                        video.pause();
                        if (isLoop) {
                            // If loop is enabled, restart from start time
                            setTimeout(() => {
                                video.currentTime = startTime;
                                video.play();
                            }, 100);
                        }
                    } else {
                        requestAnimationFrame(checkTime);
                    }
                };
                requestAnimationFrame(checkTime);
            }).catch(error => {
                console.error("Error playing video:", error);
            });
        }
    };


    if (hideControls) {
        return (
            <video
                ref={videoRef}
                src={videoUrl || undefined}
                preload="metadata"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block'
                }}
            />
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            {onDelete && (
                <button
                    onClick={onDelete}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(220, 53, 69, 0.9)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(220, 53, 69, 0.4)'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = '#dc3545';
                        e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(220, 53, 69, 0.9)';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                    title={`Delete Track ${trackNumber}`}
                >
                    ✕
                </button>
            )}

            <video ref={videoRef} src={videoUrl || undefined} preload="metadata" />
            <div className={styles['video-controls']}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                }}>
                    <h4 style={{
                        margin: '0',
                        color: '#495057',
                        fontSize: '16px',
                        fontWeight: '600'
                    }}>
                        🎬 Track {trackNumber}
                    </h4>
                    {onDelete && (
                        <button
                            onClick={onDelete}
                            style={{
                                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 6px rgba(220, 53, 69, 0.3)'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 6px rgba(220, 53, 69, 0.3)';
                            }}
                        >
                            🗑️ Delete
                        </button>
                    )}
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={isLoop || false}
                            onChange={onToggleLoop}
                        />
                        🔄 Loop Track
                    </label>
                </div>
                <div>
                    <label>
                        ⏪ Start Time:
                        <input
                            type="range"
                            min={0}
                            max={duration || 30}
                            step={0.1}
                            value={startTime}
                            onChange={handleStartTimeChange}
                        />
                        <span>{startTime.toFixed(1)}s</span>
                    </label>
                </div>
                <div>
                    <label>
                        ⏩ End Time:
                        <input
                            type="range"
                            min={0}
                            max={duration || 30}
                            step={0.1}
                            value={endTime}
                            onChange={handleEndTimeChange}
                        />
                        <span>{endTime.toFixed(1)}s</span>
                    </label>
                </div>
                <button onClick={handlePlay}>
                    ▶️ Play Range ({(endTime - startTime).toFixed(1)}s)
                </button>
            </div>
        </div>
    );
};

export default VideoPlayback;