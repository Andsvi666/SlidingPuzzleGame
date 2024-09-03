'use client'

import React, { useState } from 'react';
import styles from './previewModal.module.css';
import Image from 'next/image';

const PreviewModal = ({ image, defaultButton, onSave, onClose }) => {
    const [pressedButton, setPressedButton] = useState(defaultButton);
    const [imageGrid, setImageGrid] = useState('grid' + defaultButton);

    //function to handle grind and button style change when different button is clicked
    const handlePressedButton = (selectedButton) => {
        if (pressedButton === selectedButton){
            return;
        }else{
            setPressedButton(selectedButton);
            setImageGrid('grid' + selectedButton)
        }
    }

    return (
    <div className={styles.container}>
        <div className={styles.modalContent} >
            <h1 className={styles.header}>Preview Image</h1>
            <div className={styles.imageContainer}>
                <div className={styles.buttonsContainer}>
                <button
                    onClick={() => handlePressedButton('Normal')}
                    className={`${styles.button} ${pressedButton === 'Normal' ? styles.buttonPressed : ''}`}>  
                    Normal
                </button>
                <button
                    onClick={() => handlePressedButton('Easy')}
                    className={`${styles.button} ${pressedButton === 'Easy' ? styles.buttonPressed : ''}`}>  
                    Easy
                </button>
                <button
                    onClick={() => handlePressedButton('Medium')}
                    className={`${styles.button} ${pressedButton === 'Medium' ? styles.buttonPressed : ''}`}>  
                    Medium
                </button>
                <button
                    onClick={() => handlePressedButton('Hard')}
                    className={`${styles.button} ${pressedButton === 'Hard' ? styles.buttonPressed : ''}`}>  
                    Hard
                </button>
                </div>
                <div className={styles.image}>
                    <Image 
                        className={styles.mainImage}
                        src={'/Game Images/' + image + '.png'} 
                        height={500} 
                        width={500} 
                        alt='Current image'
                    />
                    {imageGrid != 'gridNormal' && (
                        <Image 
                            className={styles.gridImage}
                            src={'/' + imageGrid + '.png'} 
                            height={500} 
                            width={500} 
                            alt='Image grid'
                        />
                    )}
                </div>
            </div>
            <p className={styles.title}>{image}</p>
            <div className={styles.managementContainer}>
                {onSave && (
                    <button 
                        onClick={() => onSave(image)}
                        className={styles.managementButton}>
                        Confirm
                    </button>
                )}
                <button 
                    onClick={() => onClose(image)}
                    className={styles.managementButton}>
                    Close
                </button>
            </div>
        </div>
    </div>
  )
}

export default PreviewModal