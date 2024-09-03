import React, { useState, useEffect } from 'react';
import ImageCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import styles from './cropperModal.module.css';
import AlertModal from '@/components/alertModal/AlertModal';

const CropperModal = ({ image, onSave, onClose }) => {
    const [crop, setCrop] = useState();
    const [resizedImage, setResizedImage] = useState(image);
    const [newDimensions, setNewDimensions] = useState(null);
    const [alertText, setAlertText] = useState(null);
    const [renderPage, setRenderPage] = useState(false);
    

    // Checks image size if it is too big it gets resized
    useEffect(() => {
        const maxWidth = 1200;
        const maxHeight = 700;
      
        if (image.width > maxWidth || image.height > maxHeight) {
          const aspectRatio = image.width / image.height;
      
          let newWidth = image.width;
          let newHeight = image.height;
      
          if (newWidth > maxWidth) {
            newWidth = maxWidth;
            newHeight = newWidth / aspectRatio;
          }
      
          if (newHeight > maxHeight) {
            newHeight = maxHeight;
            newWidth = newHeight * aspectRatio;
          }
    
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = newWidth;
          canvas.height = newHeight;
    
          ctx.drawImage(image, 0, 0, newWidth, newHeight);
      
          const resizedImageData = canvas.toDataURL('image/png');

          const newImage = new Image();
          newImage.src = resizedImageData;
          setResizedImage(newImage);
          setRenderPage(true);
        } else {
          setResizedImage(image);
          setRenderPage(true);
        }
      }, [image]);
  
    //Changes each time crop changes
    const handleCropChange = (newCrop) => {
        setCrop(newCrop);
    }

    //When cropping changes
    const handleCropComplete = (newCrop, pixelCrop) => {
        setNewDimensions(newCrop)
    }

    //When button save is clicked given image is cropped and saved by newDimensions
    const handleNewImage = () => {
        if (newDimensions !== null) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = newDimensions.width;
            canvas.height = newDimensions.height;
        
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const scaleX = img.naturalWidth / resizedImage.width;
                const scaleY = img.naturalHeight / resizedImage.height;
                ctx.drawImage(
                  img,
                  newDimensions.x * scaleX,
                  newDimensions.y * scaleY,
                  newDimensions.width * scaleX,
                  newDimensions.height * scaleY,
                  0,
                  0,
                  newDimensions.width,
                  newDimensions.height
                );
        
              const editedImage = canvas.toDataURL('image/png');
              onSave(editedImage);
          };
      
          img.src = resizedImage.src;
        }else{
            setAlertText('No crop is select, you must move or click on crop area')
        }
    };

    //sets alert text to null
    const handleCloseAlertModal = () => {
        setAlertText(null)
    };

    if (!renderPage) {
        return; 
    }

    return (
        <div className={styles.container}>
            <div className={styles.modalContent}>
                <h1 className={styles.header}>Click selected image to crop</h1>
                <div className={styles.cropContent}>
                    <ImageCrop
                    minWidth={50}
                    minHeight={50}
                    crop={crop}
                    onChange={handleCropChange}
                    onComplete={handleCropComplete}
                    aspect={1}
                    >
                        <img
                            src={resizedImage.src}
                        />
                    </ImageCrop>
                </div>
                <div className={styles.buttonsContainer}>
                    <button className={styles.button} onClick={() => handleNewImage()}>
                        Confirm
                    </button>
                    <button className={styles.button} onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
            {alertText && (
                <AlertModal
                text = {alertText}
                onClose = {handleCloseAlertModal}
            />
            )}
        </div>
    );
};

export default CropperModal;