import React from 'react';
import VideoPlayback from './video-playback';
import styles from './multi-tile-screen.module.scss';

interface Props {
    recordings: Blob[]
}

const MultiTileScreen = ({recordings}: Props) => {
    return (
        <div className={styles['multi-tile-screen']}>
            {recordings.map((blob, index: React.Key | null | undefined) => (
                <div key={index} className={styles['video-tile']}>
                    <VideoPlayback videoBlob={blob}/>
                </div>
            ))}
        </div>
    );
};

export default MultiTileScreen;