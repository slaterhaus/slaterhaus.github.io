import React, { useState } from 'react';

const ImageLoader = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (event: { target: { files: any[]; }; }) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {selectedImage && (
                <div>
                    <h2>Selected Image:</h2>
                    <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                </div>
            )}
        </div>
    );
};

export default ImageLoader;