import React, { useState} from 'react';
import styles from './selectModalSettings.module.css';

const SelectModalSettings = ({ setting, onClose, onSave }) => {
    const [newSettings, setnewSettings] = useState(setting.id);


    //Sets new setting when it is selected
    const handleSettingChange = (selectedSetting) => {
        setnewSettings(selectedSetting);
    };

    //action to save settings
    const handleSave = () => {
        onSave(newSettings);
    };

    return (
        <div className={styles.container}>
            <div className={styles.modalContent}>
                <h1 className={styles.mainHeader}>Select Game Profile Settings</h1>
                <div className={styles.settingsContainer}>
                    <div 
                        className={`${styles.setting} ${
                            newSettings === 1 ? styles.selected : ''
                            }`}
                        onClick={() => handleSettingChange(1)}>
                        Easy
                    </div>
                    <div 
                        className={`${styles.setting} ${
                            newSettings === 2 ? styles.selected : ''
                          }`}
                        onClick={() => handleSettingChange(2)}>
                        Medium
                    </div>
                    <div 
                        className={`${styles.setting} ${
                            newSettings === 3 ? styles.selected : ''
                          }`}   
                        onClick={() => handleSettingChange(3)}>
                        Hard
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

export default SelectModalSettings;