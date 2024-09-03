import React, { useState, useEffect } from 'react';
import styles from './selectModal.module.css';
import Image from 'next/image';
import Preview from '@/components/previewModal/PreviewModal';
import {getTableData} from '@/utils/databaseActions'

const SelectModal = ({ image, onClose, onSave }) => {
    const [allImages, setAllImages] = useState([]); 
    const [newImage, setNewImage] = useState(image);
    const imagesPerPage = 3;
    const [currentPage, setCurrentPage] = useState(1);
    const lastImageIndex = currentPage * imagesPerPage;
    const firstImageIndex = lastImageIndex - imagesPerPage;
    const [viewPreview, setViewPreview] = useState(false);

    //Fetches data from database
    useEffect(() => {
        async function fetchImages() {
            const data = await getTableData('images', {});
            const approvedImages = data.filter(entry => entry.isApproved === true);
            setAllImages(approvedImages);
        }
        fetchImages();
        }, []);

    // Maintain a separate state for searched images
    const [searchTerm, setSearchTerm] = useState('');
    const filteredImages = allImages.filter((image) =>
        image.imageName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate the current images based on the search results
    const currentImages = filteredImages.slice(firstImageIndex, lastImageIndex);

    // Sets new image when it is selected from the grid
    const handleImageChange = (selectedImage) => {
        setNewImage(selectedImage);
    };

    //action to change image change
    const handleSave = () => {
        onSave(newImage);
    };


    const hasNextPage = lastImageIndex < filteredImages.length;
    const hasPreviousPage = currentPage > 1;
    const totalPages = Math.ceil(filteredImages.length / imagesPerPage);

    return (
        <div className={styles.container}>
            <div className={styles.modalContent}>
                <h1 className={styles.mainHeader}>Select Game Profile Image</h1>
                <div className={styles.currentContainer}>
                    <h2>Selected Image</h2>
                    <div className={styles.currentImage}>
                        <Image 
                            src={'/Game Images/' + newImage.imageName + '.png'} 
                            height={250} 
                            width={250} 
                            alt='Current image'
                        />
                    </div>
                    <button
                        className={styles.button}
                        onClick={() => setViewPreview(true)}
                        >
                        Preview Image
                    </button>
                    {viewPreview && (
                        <Preview
                        image={newImage.imageName}
                        defaultButton={'Normal'} 
                        onSave={false}
                        onClose={() => setViewPreview(false)} 
                        />
                    )}
                </div>
                <div className={styles.selectContainer}>
                    <h2>Select New Image</h2>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Search images..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <div className={styles.imageGrid}>
                        {currentImages.map((image) => (
                            <div
                                key={image.id}
                                className={styles.imageItem}
                                onClick={() => handleImageChange(image)}
                            >
                                <div className={styles.imageSelect}>
                                    <Image 
                                        src={'/Game Images/' + image.imageName + '.png'} 
                                        height={100} 
                                        width={100} 
                                        alt='Selected Image'
                                    />
                                </div>
                                <p>{image.imageName}</p>
                            </div>
                        ))}
                    </div>
                    <div className={styles.pagination}>
                        <button
                            className={`${styles.button} ${styles.pageButton}`}
                            onClick={() => {
                                if (hasPreviousPage) 
                                {
                                    setCurrentPage(currentPage - 1);
                                }
                            }}
                            disabled={!hasPreviousPage}
                        >
                        &lt;
                        </button>
                        <p>Page {currentPage} of {totalPages}</p>
                        <button
                            className={`${styles.button} ${styles.pageButton}`}
                            onClick={() => {
                                if (hasNextPage) 
                                {
                                    setCurrentPage(currentPage + 1);
                                }
                            }}
                            disabled={!hasNextPage}
                        >
                        &gt;
                        </button>
                    </div>
                </div>
                <div className={styles.buttonsContainer}>
                <button 
                    onClick={handleSave}
                    className={styles.button}>
                    Confirm
                </button>
                <button 
                    onClick={onClose}
                    className={styles.button}>
                    Cancel
                </button>
                </div>
            </div>
        </div>
    );
};

export default SelectModal;