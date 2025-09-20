"use client";
import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import ClickTrack from './click-track';

interface WebcamRecorderProps {
    onRecordingComplete: (recordingBlob: Blob) => void;
    existingRecordings?: Blob[];
}

const WebcamRecorder = ({ onRecordingComplete, existingRecordings = [] }: WebcamRecorderProps) => {
    const webcamRef = useRef<Webcam>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [bpm, setBpm] = useState(120);
    const [useClickTrack, setUseClickTrack] = useState(false);
    const [countOff, setCountOff] = useState(4);
    const [playExistingTracks, setPlayExistingTracks] = useState(true);
    const [isCountingOff, setIsCountingOff] = useState(false);
    const playbackVideosRef = useRef<HTMLVideoElement[]>([]);
    const [videoUrls, setVideoUrls] = useState<string[]>([]);

    // Create stable URLs for videos
    useEffect(() => {
        // Clean up old URLs
        videoUrls.forEach(url => URL.revokeObjectURL(url));

        // Create new URLs
        const newUrls = existingRecordings.map(blob => URL.createObjectURL(blob));
        setVideoUrls(newUrls);

        // Reset video refs
        playbackVideosRef.current = [];

        // Cleanup function
        return () => {
            newUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [existingRecordings]);

    const handleDataAvailable = useCallback(
        ({ data }: { data: Blob }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => [...prev, data]);
            }
        },
        []
    );

    const handleCountOffComplete = useCallback(() => {
        // Start recording after count-off completes
        if (!webcamRef.current?.stream) {
            console.error("No webcam stream available");
            return;
        }

        // Debug: Check what tracks are available
        const stream = webcamRef.current.stream;
        console.log("Stream tracks:", stream.getTracks().map(track => ({
            kind: track.kind,
            enabled: track.enabled,
            muted: track.muted,
            readyState: track.readyState
        })));

        setRecordedChunks([]);

        // Try different mimeTypes with audio support
        let options;
        if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")) {
            options = { mimeType: "video/webm;codecs=vp8,opus" };
        } else if (MediaRecorder.isTypeSupported("video/webm")) {
            options = { mimeType: "video/webm" };
        } else if (MediaRecorder.isTypeSupported("video/mp4")) {
            options = { mimeType: "video/mp4" };
        } else {
            options = {};
        }

        console.log("MediaRecorder options:", options);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, options);
        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
        mediaRecorderRef.current.start();

        // Start playback of existing tracks if enabled
        if (playExistingTracks && playbackVideosRef.current.length > 0) {
            console.log("Starting playback of", playbackVideosRef.current.length, "existing tracks");
            playbackVideosRef.current.forEach((video, index) => {
                if (video) {
                    console.log(`Starting playback of track ${index}, readyState:`, video.readyState);

                    const startPlayback = () => {
                        video.currentTime = 0;
                        video.play().catch(err => console.error(`Error playing track ${index}:`, err));
                    };

                    // If video is ready, play immediately
                    if (video.readyState >= 2) { // HAVE_CURRENT_DATA
                        startPlayback();
                    } else {
                        // Wait for video to be ready
                        const onCanPlay = () => {
                            video.removeEventListener('canplay', onCanPlay);
                            startPlayback();
                        };
                        video.addEventListener('canplay', onCanPlay);

                        // Force load if needed
                        video.load();
                    }
                }
            });
        }
    }, [webcamRef, handleDataAvailable, playExistingTracks]);

    const handleStartCaptureClick = useCallback(() => {
        if (!webcamRef.current?.stream) {
            console.error("No webcam stream available");
            return;
        }
        setCapturing(true);
        setIsCountingOff(true);

        if (!useClickTrack) {
            // If no click track, start recording immediately
            handleCountOffComplete();
        }
        // If using click track, recording will start when count-off completes
    }, [webcamRef, useClickTrack, handleCountOffComplete]);

    const handleStopCaptureClick = useCallback(() => {
        if (!mediaRecorderRef.current) {
            console.error("No MediaRecorder to stop");
            return;
        }
        mediaRecorderRef.current.stop();
        setCapturing(false);
        setIsCountingOff(false);

        // Stop playback of existing tracks
        if (playbackVideosRef.current.length > 0) {
            console.log("Stopping playback of existing tracks");
            playbackVideosRef.current.forEach((video, index) => {
                if (video) {
                    console.log(`Stopping track ${index}`);
                    video.pause();
                }
            });
        }
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
            <div style={{
                marginBottom: '25px',
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: useClickTrack ? '#e8f5e8' : '#f8f9fa',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: `2px solid ${useClickTrack ? '#28a745' : '#dee2e6'}`,
                    fontWeight: '500'
                }}>
                    <input
                        type="checkbox"
                        checked={useClickTrack}
                        onChange={(e) => setUseClickTrack(e.target.checked)}
                        style={{ transform: 'scale(1.2)' }}
                    />
                    🥁 Use Click Track
                </label>
                {existingRecordings && existingRecordings.length > 0 && (
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: playExistingTracks ? '#e8f5e8' : '#f8f9fa',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: `2px solid ${playExistingTracks ? '#28a745' : '#dee2e6'}`,
                        fontWeight: '500'
                    }}>
                        <input
                            type="checkbox"
                            checked={playExistingTracks}
                            onChange={(e) => setPlayExistingTracks(e.target.checked)}
                            style={{ transform: 'scale(1.2)' }}
                        />
                        🎵 Play existing tracks during recording
                    </label>
                )}
            </div>

            {useClickTrack && (
                <ClickTrack
                    bpm={bpm}
                    isPlaying={capturing}
                    onBpmChange={setBpm}
                    countOff={countOff}
                    onCountOffChange={setCountOff}
                    onCountOffComplete={handleCountOffComplete}
                />
            )}

            {playExistingTracks && existingRecordings && existingRecordings.length > 0 && (
                <div style={{
                    marginBottom: '25px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    borderRadius: '12px',
                    color: 'white',
                    boxShadow: '0 6px 20px rgba(40, 167, 69, 0.3)'
                }}>
                    <h4 style={{
                        margin: '0 0 15px 0',
                        fontSize: '1.3rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        🎬 Existing Tracks ({existingRecordings?.length || 0})
                        <span style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '700'
                        }}>
                            WILL PLAY WITH AUDIO
                        </span>
                    </h4>
                    <p style={{
                        margin: '0 0 20px 0',
                        fontSize: '16px',
                        opacity: '0.9',
                        lineHeight: '1.4'
                    }}>
                        These tracks will automatically start playing when your count-off completes, so you can record in perfect sync with them.
                    </p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '15px'
                    }}>
                        {videoUrls.map((url, index) => (
                            <div key={index} style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                padding: '12px',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <video
                                    ref={(el) => {
                                        if (el) playbackVideosRef.current[index] = el;
                                    }}
                                    src={url}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: '6px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                                    }}
                                    muted={false}
                                    loop
                                    controls
                                    preload="metadata"
                                />
                                <div style={{
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    marginTop: '8px',
                                    fontWeight: '600'
                                }}>
                                    🎬 Track {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{
                background: 'linear-gradient(135deg, #495057 0%, #343a40 100%)',
                borderRadius: '16px',
                padding: '25px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {capturing && (
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        background: 'linear-gradient(90deg, #dc3545, #fd7e14, #ffc107, #28a745, #20c997, #0dcaf0, #6f42c1)',
                        height: '4px',
                        animation: 'recordingGlow 2s ease-in-out infinite alternate'
                    }} />
                )}

                <div style={{
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>
                    <h3 style={{
                        color: 'white',
                        margin: '0 0 10px 0',
                        fontSize: '1.4rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}>
                        📹 Recording Studio
                        {capturing && (
                            <span style={{
                                background: '#dc3545',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                animation: 'pulse 1s infinite'
                            }}>
                                RECORDING
                            </span>
                        )}
                    </h3>
                    {!capturing && (
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            margin: '0',
                            fontSize: '16px'
                        }}>
                            Ready to record track {(existingRecordings?.length || 0) + 1}
                        </p>
                    )}
                </div>

                <div style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '12px',
                    padding: '15px',
                    marginBottom: '20px'
                }}>
                    <Webcam
                        audio={true}
                        ref={webcamRef}
                        muted={true}
                        videoConstraints={{
                            width: 640,
                            height: 480,
                            facingMode: "user"
                        }}
                        audioConstraints={{
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true
                        }}
                        style={{
                            width: '100%',
                            borderRadius: '8px',
                            boxShadow: capturing ? '0 0 30px rgba(220, 53, 69, 0.5)' : '0 4px 20px rgba(0, 0, 0, 0.3)'
                        }}
                    />
                </div>

                <div style={{ textAlign: 'center' }}>
                    {capturing ? (
                        <button
                            onClick={handleStopCaptureClick}
                            style={{
                                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '15px 30px',
                                borderRadius: '12px',
                                fontSize: '18px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 6px 20px rgba(220, 53, 69, 0.4)',
                                animation: 'pulse 2s infinite'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            ⏹ Stop Recording
                        </button>
                    ) : (
                        <button
                            onClick={handleStartCaptureClick}
                            style={{
                                background: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '15px 30px',
                                borderRadius: '12px',
                                fontSize: '18px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 6px 20px rgba(220, 53, 69, 0.4)'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(220, 53, 69, 0.6)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.4)';
                            }}
                        >
                            ⏺ Start Recording
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebcamRecorder;