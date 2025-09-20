import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './multi-tile-screen.module.scss';

interface Props {
    recordings: Blob[];
    onDeleteRecording?: (index: number) => void;
    onPresentationModeChange?: (isPresenting: boolean) => void;
}

const MultiTileScreen = ({ recordings, onDeleteRecording, onPresentationModeChange }: Props) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [loopStates, setLoopStates] = useState<boolean[]>(recordings.map(() => false));
    const [isPresentationMode, setIsPresentationMode] = useState(false);

    // Keep per-video refs for controlling playback
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    // Keep object URLs for blobs, clean up on change/unmount
    const [objectUrls, setObjectUrls] = useState<string[]>([]);
    React.useEffect(() => {
        const urls = recordings.map((blob) => URL.createObjectURL(blob));
        setObjectUrls(urls);
        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [recordings]);

    // Update loop states when recordings change
    React.useEffect(() => {
        setLoopStates((prev) => {
            const newLoopStates = recordings.map((_, index) =>
                prev[index] !== undefined ? prev[index] : false
            );
            return newLoopStates;
        });
    }, [recordings]);

    const handlePlayPause = () => {
        setIsPlaying((p) => !p);
        // Control all videos
        videoRefs.current.forEach((v) => {
            if (!v) return;
            if (!isPlaying) {
                v.play().catch(() => {});
            } else {
                v.pause();
            }
        });
    };

    const handleTimeUpdate = (time: number) => {
        setCurrentTime(time);
    };

    const handleToggleLoop = (index: number) => {
        const newLoopStates = [...loopStates];
        newLoopStates[index] = !newLoopStates[index];
        setLoopStates(newLoopStates);

        // Update the video element's loop property
        if (videoRefs.current[index]) {
            videoRefs.current[index]!.loop = newLoopStates[index];
        }
    };

    const handleSeek = (time: number) => {
        setCurrentTime(time);
        // Seek all videos
        videoRefs.current.forEach((v) => {
            if (v && v.readyState >= 1) {
                try {
                    v.currentTime = time;
                } catch {
                    // Ignore seek errors
                }
            }
        });
    };

    const togglePresentationMode = () => {
        const newMode = !isPresentationMode;

        setIsPresentationMode(newMode);
        onPresentationModeChange?.(newMode);

        // Force start playing when entering presentation mode
        if (newMode) {
            setIsPlaying(true);
        }
    };

    // Handle escape key to exit presentation mode
    React.useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isPresentationMode) {
                setIsPresentationMode(false);
            }
        };

        if (isPresentationMode) {
            document.addEventListener('keydown', handleKeyPress);
            return () => document.removeEventListener('keydown', handleKeyPress);
        }
    }, [isPresentationMode]);

    // Lock body scroll while in presentation mode
    React.useEffect(() => {
        if (!isPresentationMode) return;
        const prevBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prevBodyOverflow;
        };
    }, [isPresentationMode]);

    // Keep videos play/pause in sync
    React.useEffect(() => {
        videoRefs.current.forEach((v) => {
            if (!v) return;
            if (isPlaying) {
                // Ensure video is ready before playing
                if (v.readyState >= 2) {
                    v.play().catch(() => {
                        // Ignore autoplay errors
                    });
                } else {
                    // Wait for video to be ready
                    const onCanPlay = () => {
                        v.removeEventListener('canplay', onCanPlay);
                        v.play().catch(() => {});
                    };
                    v.addEventListener('canplay', onCanPlay);
                }
            } else {
                v.pause();
            }
        });
    }, [isPlaying]);

    // Sync currentTime if it changes
    React.useEffect(() => {
        if (!isPresentationMode) return;
        videoRefs.current.forEach((v) => {
            if (!v) return;
            // Only set if metadata is ready
            if (v.readyState >= 1 && Number.isFinite(currentTime)) {
                try {
                    v.currentTime = currentTime;
                } catch {
                    // Ignore seek errors
                }
            }
        });
    }, [currentTime, isPresentationMode]);

    // Calculate optimal grid layout
    const getGridLayout = (count: number) => {
        if (count === 1) return { cols: 1, rows: 1 };
        if (count === 2) return { cols: 2, rows: 1 };
        if (count === 3) return { cols: 3, rows: 1 };
        if (count === 4) return { cols: 2, rows: 2 };
        if (count <= 6) return { cols: 3, rows: 2 };
        if (count <= 9) return { cols: 3, rows: 3 };
        return { cols: 4, rows: Math.ceil(count / 4) };
    };

    const { cols, rows } = getGridLayout(recordings.length);

    // No portals needed - just CSS styling

    // Main UI with conditional presentation mode styling
    return (
        <div
            className={styles.container}
            style={isPresentationMode ? {
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9998,
                backgroundColor: '#000',
                display: 'flex',
                flexDirection: 'column'
            } : {}}
        >
            {/* Normal mode controls */}
            {!isPresentationMode && (
                <div className={styles.controls}>
                    <button
                        className={styles.button}
                        onClick={handlePlayPause}
                        disabled={recordings.length === 0}
                    >
                        {isPlaying ? '⏸️ Pause All' : '▶️ Play All'}
                    </button>
                    <button
                        className={styles.presentationButton}
                        onClick={togglePresentationMode}
                        disabled={recordings.length === 0}
                        title={recordings.length === 0 ? 'Add recordings to enable' : 'Enter presentation mode'}
                    >
                        🎭 Presentation mode
                    </button>
                    <input
                        type="range"
                        min={0}
                        max={30}
                        step={0.1}
                        value={currentTime}
                        onChange={(e) => handleSeek(parseFloat(e.target.value))}
                        style={{ width: '200px', marginLeft: '10px' }}
                    />
                    <span>{currentTime.toFixed(1)}s</span>
                </div>
            )}

            {/* Presentation mode controls */}
            {isPresentationMode && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    right: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 10000,
                    pointerEvents: 'none'
                }}>
                    <button
                        onClick={handlePlayPause}
                        style={{
                            background: 'rgba(255, 255, 255, 0.12)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#fff',
                            borderRadius: '8px',
                            padding: '10px 14px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            pointerEvents: 'auto',
                            backdropFilter: 'blur(6px)',
                        }}
                        title={isPlaying ? 'Pause All' : 'Play All'}
                    >
                        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                    </button>

                    <button
                        onClick={togglePresentationMode}
                        style={{
                            background: 'rgba(255, 255, 255, 0.12)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#fff',
                            borderRadius: '8px',
                            padding: '10px 14px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            pointerEvents: 'auto',
                            backdropFilter: 'blur(6px)',
                        }}
                        title="Exit (Esc)"
                    >
                        ✕ Exit
                    </button>
                </div>
            )}

            {/* Time display for presentation mode */}
            {isPresentationMode && (
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: '#fff',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backdropFilter: 'blur(6px)',
                    zIndex: 10000
                }}>
                    {currentTime.toFixed(1)}s
                </div>
            )}

                {/* Video grid */}
                <div
                    className={styles['multi-tile-screen']}
                    style={isPresentationMode ? {
                        flex: 1,
                        display: 'grid',
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        gridTemplateRows: `repeat(${rows}, 1fr)`,
                        gap: '4px',
                        padding: '8px',
                        margin: 0,
                        borderRadius: 0,
                        background: 'transparent'
                    } : {}}
                >
                    {objectUrls.map((url, i) => (
                        <div
                            key={i}
                            className={styles['video-tile']}
                            style={isPresentationMode ? {
                                background: '#000',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            } : {}}
                        >
                            <video
                                className={styles.video}
                                ref={(el) => (videoRefs.current[i] = el)}
                                src={url}
                                playsInline
                                muted={false}
                                autoPlay={false}
                                preload="auto"
                                loop={!!loopStates[i]}
                                controls={!isPresentationMode}
                                style={isPresentationMode ? {
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain'
                                } : {}}
                                onLoadedMetadata={(e) => {
                                    // Ensure first frame is shown even before playing
                                    const v = e.currentTarget as HTMLVideoElement;
                                    if (!isPresentationMode) return;
                                    try { v.currentTime = currentTime || 0; } catch {}
                                }}
                                onTimeUpdate={(e) => {
                                    if (i === 0) { // Use first video as time master
                                        const t = (e.currentTarget as HTMLVideoElement).currentTime;
                                        setCurrentTime(t);
                                    }
                                }}
                            />
                            {/* Video controls - hidden in presentation mode */}
                            {!isPresentationMode && (
                                <div className={styles['video-controls']}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={!!loopStates[i]}
                                            onChange={() => handleToggleLoop(i)}
                                        />
                                        Loop
                                    </label>
                                    {onDeleteRecording && (
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => onDeleteRecording(i)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
        </div>
    );
};

export default MultiTileScreen;