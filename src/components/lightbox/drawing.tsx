"use client";
import React, {useRef, useState, useCallback, useEffect} from 'react';
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
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [opacity, setOpacity] = useState(0.5);
    const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
    const [currentCamera, setCurrentCamera] = useState('user');
    const [orientationPermission, setOrientationPermission] = useState('unknown');

    const handleOrientation = (event: { alpha: any; beta: any; gamma: any; }) => {
        setOrientation({
            alpha: event.alpha || 0, // Z-axis rotation [0,360)
            beta: event.beta || 0,   // X-axis rotation [-180,180]
            gamma: event.gamma || 0  // Y-axis rotation [-90,90]
        });
    };

    const requestPermission = useCallback(async () => {
        if (typeof (DeviceOrientationEvent as DeviceOrientationEventiOSConstructor).requestPermission === 'function') {
            try {
                if (!DeviceOrientationEvent) return;
                const permission = await (DeviceOrientationEvent as any)?.requestPermission();
                if (permission === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                }
            } catch (error) {
                console.error('Error requesting device orientation permission:', error);
            }
        } else {
            // For non-iOS devices or older versions that don't require permission
            window.addEventListener('deviceorientation', handleOrientation);
        }
    }, [handleOrientation]);

    const handleImageChange = (event: React.ChangeEvent<any>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e?.target?.result !== null) {
                    setSelectedImage(e?.target?.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOpacityChange = (e: { target: { value: string; }; }) => {
        setOpacity(parseFloat(e.target.value));
    };
    const getImageTransform = () => {
        const { alpha, beta, gamma } = orientation;
        return `rotateZ(${alpha}deg) rotateX(${beta}deg) rotateY(${gamma}deg)`;
    };
    useEffect(() => {
        if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window && orientationPermission === 'granted' ) {
            window.addEventListener('deviceorientation', handleOrientation, true);
            return () => {
                window.removeEventListener('deviceorientation', handleOrientation, true);
            };
        }
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{facingMode: 'environment'}}
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
                    }}
                />
            )}
            <div style={{position: 'absolute', top: 10, left: 10}}>
                <pre>{JSON.stringify(orientation)}</pre>
                <input type="file" accept="image/*"
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageChange(e)}/>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={opacity}
                    onChange={handleOpacityChange}
                />
                <button
                    onClick={requestPermission}
                >
                    Request Orientation Permission
                </button>
            </div>
        </div>
    );
};

export default ImageDrawingComponent;