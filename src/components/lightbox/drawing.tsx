"use client";
import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
    requestPermission?: () => Promise<PermissionState>;
}

type DeviceOrientationEventiOSConstructor = {
    new(type: string, eventInitDict?: DeviceOrientationEventInit): DeviceOrientationEventiOS;
    requestPermission?: () => Promise<PermissionState>;
};

const ImageDrawingComponent = () => {
    const webcamRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [opacity, setOpacity] = useState(0.5);
    const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 });
    const [deviceOrientation, setDeviceOrientation] = useState('portrait');
    const [currentCamera, setCurrentCamera] = useState('environment');
    const [orientationPermission, setOrientationPermission] = useState('unknown');

    const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
        setOrientation({
            beta: event.beta || 0,
            gamma: event.gamma || 0,
        });

        setDeviceOrientation(
            window.screen.orientation.type.includes('landscape') ? 'landscape' : 'portrait'
        );
    }, []);

    const requestPermission = useCallback(async () => {
        if (typeof (DeviceOrientationEvent as DeviceOrientationEventiOSConstructor).requestPermission === 'function') {
            try {
                const permission = await (DeviceOrientationEvent as any).requestPermission();
                setOrientationPermission(permission);
                if (permission === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                }
            } catch (error) {
                console.error('Error requesting device orientation permission:', error);
            }
        } else {
            // For non-iOS devices or older versions that don't require permission
            setOrientationPermission('granted');
            window.addEventListener('deviceorientation', handleOrientation);
        }
    }, [handleOrientation]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e?.target?.result && typeof e.target.result === 'string') {
                    setSelectedImage(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOpacity(parseFloat(e.target.value));
    };

    const getImageTransform = () => {
        const { beta, gamma } = orientation;
        if (deviceOrientation === 'portrait') {
            return `rotateX(${-beta}deg)`;
        } else {
            return `rotateY(${gamma}deg)`;
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window && orientationPermission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
            return () => {
                window.removeEventListener('deviceorientation', handleOrientation, true);
            };
        }
    }, [orientationPermission, handleOrientation]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: currentCamera }}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />
            {selectedImage && (
                <img
                    src={selectedImage}
                    alt="Overlay"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: opacity,
                        transform: getImageTransform(),
                        objectFit: 'contain',
                        pointerEvents: 'none',
                        transformOrigin: 'center',
                    }}
                />
            )}
            <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px' }}>
                <pre>{JSON.stringify({ orientation, deviceOrientation }, null, 2)}</pre>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={opacity}
                    onChange={handleOpacityChange}
                />
                <button onClick={requestPermission}>
                    Request Orientation Permission
                </button>
            </div>
        </div>
    );
};

export default ImageDrawingComponent;