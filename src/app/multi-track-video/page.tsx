"use client";
import React, {useCallback, useState} from 'react';
import WebcamRecorder from "@/components/multi-track-video/webcam-recorder";
import MultiTileScreen from "@/components/multi-track-video/multi-tile-screen";

const Page = () => {
    const [recordings, setRecordings] = useState<Blob[]>([]);
    const [isPresentationMode, setIsPresentationMode] = useState(false);

    const handleRecordingComplete = (recording: Blob) => {
        setRecordings([...recordings, recording]);
    };
    const reset = useCallback(() => {
        setRecordings([]);
    }, [setRecordings]);

    const handleDeleteRecording = useCallback((index: number) => {
        setRecordings(prev => prev.filter((_, i) => i !== index));
    }, []);

    const handlePresentationModeChange = useCallback((isPresenting: boolean) => {
        setIsPresentationMode(isPresenting);
    }, []);

    return (
        <>
            {/* Main page content - hidden during presentation mode */}
            {!isPresentationMode && (
                <div style={{
                    padding: '20px',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                }}>
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '40px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '30px',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <h1 style={{
                            margin: '0 0 15px 0',
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            🎬 Multi-Track Video Studio
                        </h1>
                        <p style={{
                            margin: '0 0 25px 0',
                            color: '#6c757d',
                            fontSize: '1.2rem',
                            fontWeight: '400'
                        }}>
                            Create layered video performances with synchronized recording and playback
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: '#e8f5e8',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontSize: '14px',
                                color: '#28a745'
                            }}>
                                ✓ Click Track
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: '#e8f5e8',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontSize: '14px',
                                color: '#28a745'
                            }}>
                                ✓ Synchronized Playback
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: '#e8f5e8',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontSize: '14px',
                                color: '#28a745'
                            }}>
                                ✓ Loop Controls
                            </div>
                        </div>

                        {recordings.length > 0 && (
                            <div style={{ marginTop: '20px' }}>
                                <button
                                    onClick={reset}
                                    style={{
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = '#c82333';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = '#dc3545';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    🗑️ Reset All Recordings ({recordings.length})
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '16px',
                        padding: '30px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)',
                        marginBottom: '30px'
                    }}>
                        <WebcamRecorder
                            onRecordingComplete={handleRecordingComplete}
                            existingRecordings={recordings}
                        />
                    </div>

                    {recordings.length > 0 && (
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '16px',
                            padding: '30px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <h2 style={{
                                textAlign: 'center',
                                marginBottom: '25px',
                                fontSize: '1.8rem',
                                fontWeight: '600',
                                color: '#495057',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}>
                                🎥 Your Multi-Track Video
                                <span style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '0.9rem',
                                    fontWeight: '700'
                                }}>
                                    {recordings.length} track{recordings.length !== 1 ? 's' : ''}
                                </span>
                            </h2>
                        </div>
                    )}
                </div>
            )}

            {/* MultiTileScreen always rendered but with conditional presentation mode */}
            {recordings.length > 0 && (
                <MultiTileScreen
                    recordings={recordings}
                    onDeleteRecording={handleDeleteRecording}
                    onPresentationModeChange={handlePresentationModeChange}
                />
            )}
        </>
    );
};

export default Page;