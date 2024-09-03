'use client'

import React, { useRef, useState, useEffect } from 'react';
import style from './page.module.css';
import ImageNext from 'next/image';
import Configure from '@/components/configureModal/ConfigureModal';
import Select from '@/components/selectModal/SelectModal';
import SelectSettings  from '@/components/selectModalSettings/SelectModalSettings';
import CropperModal from '@/components/cropperModal/CropperModal'
import AlertModal from '@/components/alertModal/AlertModal';
import Preview from '@/components/previewModal/PreviewModal';
import {insertEntry} from '@/utils/databaseActions';
import {editEntry} from '@/utils/databaseActions'
import {selectEntry} from '@/utils/databaseActions';
import {getTableData} from '@/utils/databaseActions'
import {createImage} from '@/utils/fileActions';
import {deleteImage} from '@/utils/fileActions';
import cookie from 'js-cookie';

const Profile = () => {
  const [authorizedUser, setAuthorizedUser] = useState('');
  const [totalGames, setTotalGames] = useState('');
  const [totalTime, setTotalTime] = useState('');
  const [totalScore, setTotalScore] = useState('');
  const [bestScore, setBestScore] = useState('');
  const [gameProfiles, setGameProfiles] = useState('');
  const [gameProfileSettings, setGameProfileSettings] = useState('');
  const [gameProfileImages, setGameProfileImages] = useState('');
  const [expandedProfile, setExpandedProfile] = useState(0);
  const [revealPassword, setRevealPassword] = useState(false);
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isSelectSettingsModalOpen, setIsSelectSettingsModalOpen] = useState(false);
  const [settingsToChange, setSettingsToChange] = useState(null);
  const [imageToChange, setImageToChange] = useState(null);
  const fileInputRef = useRef(null);
  const [cropperItem, setCropperItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [alertText, setAlertText] = useState(null);
  const [state, setState] = useState(false)
  const [stateNewImage, setStateNewImage] = useState(null)
  const [stateNewPreviewImage, setStateNewPreviewImage] = useState(null)
  const [renderPage, setRenderPage] = useState(false);

  // Checks if correct user accesses the page
  useEffect(() => {
    const ck = cookie.get('currentUser');
    if (ck === undefined) {
      window.location.href = '/';
    } else {
      setRenderPage(true);
    }
  }, []);
  
  //Fetches data from database
  useEffect(() => {
    async function fetchData() {
      const types = ['Standart', 'Premium', 'Admin'];
      const ck = cookie.get('currentUser');
      const dataArray = ck.split(' ');
      const userId = parseInt(dataArray[0]);
      const user = await selectEntry('user_profiles', parseInt(userId));
      user.type = types[user.type - 1];
      setAuthorizedUser(user);
      const results = await getTableData('game_results', {});
      handleUserExtraInfo(user, results);
      const gameProfiles = await getTableData('game_profiles', {
        images: true,
        game_settings: true,
      });
      handleGameProfilesInfo(user, gameProfiles);
    }
    fetchData();
  }, []);

  //handles extra info about user: total games played, total score and best score
  const handleUserExtraInfo = (user, results) => {
    const filteredResults = results.filter(entry => entry.player === user.id);
    setTotalGames(filteredResults.length);
    const timeSum = filteredResults.reduce((sum, entry) => sum + entry.time, 0);
    setTotalTime(timeSum)
    const scoreSum = filteredResults.reduce((sum, entry) => sum + entry.score, 0);
    setTotalScore(scoreSum);
    const bestScoreEntry = filteredResults.reduce((maxEntry, entry) => (entry.score > maxEntry.score ? entry : maxEntry), filteredResults[0]);
    const bestScore = bestScoreEntry ? bestScoreEntry.score : 0;
    setBestScore(bestScore);
  }

  //handles current user game profiles info
  const handleGameProfilesInfo = (user, gameProfiles) => {
    const userProfiles = gameProfiles.filter(entry => entry.user === user.id);
    setGameProfiles(userProfiles);
    setGameProfileSettings(userProfiles.map(entry => entry.game_settings))
    setGameProfileImages(userProfiles.map(entry => entry.images))
  }

  //Reveals password when reveal is clicked. Changes style class and text
  const togglePasswordVisibility = () => {
    if(revealPassword === false){
      setRevealPassword(true);
    }
  };

  // When "Configure information" button is clicked, open the modal
  const handleOpenConfigureModal = () => {
    setIsConfigureModalOpen(true);
  };

  //closes configuration modal
  const handleConfigureModalClose = () => {
    setIsConfigureModalOpen(false);
    window.location.reload();
  };

  // When "Change" button is clicked, open the modal
  const handleOpenSelectModal = (image) => {
    setImageToChange(image);
    setIsSelectModalOpen(true)
  };

  //saves image from select modal
  const handleSelectModalSave = (image) => {
    const entryData = {selectedImage: image.id};
    editEntry('game_profiles', gameProfiles[expandedProfile].id, entryData);
    const serverLog = {
      logText: `User ${authorizedUser.username} changed their game profile ${expandedProfile + 1} image to ${image.imageName}`,
      user: authorizedUser.id,
      type: 2,
    }
    insertEntry('server_logs', serverLog)
    setImageToChange(image);
    setIsSelectModalOpen(false);
    setState(true);
    setAlertText("Image changed succesfully")
  }

  //closes select modal
  const handleSelectModalClose = () => {
    setIsSelectModalOpen(false)
  }

  // When "Change" button is clicked, open the modal
  const handleOpenSelectSettingsModal = (settings) => {
    setSettingsToChange(settings);
    setIsSelectSettingsModalOpen(true)
  };

  //saves settings from select settings modal
  const handleSelectSettingsModalSave = (settings) => {
    const entryData = {selectedSettings: settings};
    editEntry('game_profiles', gameProfiles[expandedProfile].id, entryData);
    const serverLog = {
      logText: `User ${authorizedUser.username} changed their game profile ${expandedProfile + 1} settings`,
      user: authorizedUser.id,
      type: 2,
    }
    insertEntry('server_logs', serverLog)
    setSettingsToChange(settings);
    setIsSelectSettingsModalOpen(false)
    setState(true);
    setAlertText("Settings  changed succesfully")
  }

  //closes select settings modal
  const handleSelectSettingsModalClose = () => {
    setIsSelectSettingsModalOpen(false)
  }

  //Selects clicked game profile and expands it
  const toggleProfile = (profileNumber) => {
    setExpandedProfile((prevExpandedProfile) => {
      return prevExpandedProfile === profileNumber ? null : profileNumber;
    });
  };

  //If profile is expanded then data is displayed
  const isProfileExpanded = (profileNumber) => {
    return expandedProfile === profileNumber;
  };

  const handleImageUpload = () => {
    if (
      authorizedUser.type === 'Admin' ||
      (authorizedUser.type === 'Standart' && authorizedUser.picturesCount < 3) ||
      (authorizedUser.type === 'Premium' && authorizedUser.picturesCount < 10)
    ) {
      fileInputRef.current.click();
    } else {
      setAlertText('You have reached the maximum limit of available uploads');
    }
  };
  
  //turns selected file into object
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'image/png') {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result;
          console.log(img.height, img.width);
          img.onload = () => {
            if(img.height >= 100 && img.width >= 100)
            {
              setAlertText('New image is being uploaded');
              setStateNewImage(img);
            }else{
              setAlertText('Image width and height must be above 100 pixels');
            }
          };
        };
        reader.readAsDataURL(file);
      } else {
        setAlertText('Only .png image format is allowed');
        fileInputRef.current.value = '';
      }
    }
  };
  
  //Closes the crop modal
  const handleCroplClose = () => {
    setAlertText("Image uploaded has been cancelled while cropping")
    setState(true)
  };
  
  //return image from cropModal
  const handleCropSave = (croppedImage) => {
    const newName = authorizedUser.username + new Date().getTime().toString().slice(5, 11);
    createImage(croppedImage, newName);
    setAlertText("Image cropped successfully")
    setStateNewPreviewImage(newName)
    fileInputRef.current.value = '';
  };


  const handleClosePreviewModal = (imageName) =>{
    deleteImage(imageName)
    setAlertText("Image uploaded has been cancelled after preview")
    setState(true)
  }

  const handleSavePreviewModal = (imageName) =>{
    handleFileSave(imageName)
  }


  //to handle image being saved
  const handleFileSave = (imageName) => {
    editEntry('user_profiles', authorizedUser.id, {picturesCount: authorizedUser.picturesCount + 1}); 
    insertEntry('images', {imageName: imageName, isApproved: false, userAuthor: authorizedUser.id})
    const serverLog = {
      logText: `User ${authorizedUser.username} uploaded new image ${imageName}`,
      user: authorizedUser.id,
      type: 2,
    }
    insertEntry('server_logs', serverLog)
    setAlertText("New image uploaded successfully");
    setState(true)
  }

  //sets alert text to null
  const handleCloseAlertModal = () => {
    setAlertText(null)
    if(state){
      window.location.reload();
    }
    if(stateNewImage !== null){
      setCropperItem(stateNewImage);
    }
    if(stateNewPreviewImage !== null){
      setPreviewItem(stateNewPreviewImage);
    }
  };

  if (!renderPage) {
    return; 
  }

  return (
    <div className={style.container}>
      <div className={style.userContainer}>
        <h2 className={style.header}>User Information</h2>
        <div className={style.userProfileContainer}>
          <div className={style.infoList}>
            <div className={style.listEntry}>
              <p className={style.listEntryName}>Username</p>
              <p className={style.listText}>{authorizedUser.username}</p>
            </div>
            {/*
            <div className={style.listEntry}>
              <p className={style.listEntryName}>Password</p>
              <span
                className={revealPassword ? style.listText : style.clickToReveal}
                onClick={togglePasswordVisibility}
              >
                {revealPassword ? (authorizedUser.password) : "Click to Reveal"}
              </span>
            </div>
            */}
            <div className={style.listEntry}>
              <p className={style.listEntryName}>User type</p>
              <p className={style.listText}>{authorizedUser.type}</p>
            </div>
            <div className={style.listEntry}>
              <p className={style.listEntryName}>Games played</p>
              <p className={style.listText}>{totalGames}</p>
            </div>
            <div className={style.listEntry}>
              <p className={style.listEntryName}>Total seconds played</p>
              <p className={style.listText}>{totalTime}</p>
            </div>
            <div className={style.listEntry}>
              <p className={style.listEntryName}>Total score</p>
              <p className={style.listText}>{totalScore}</p>
            </div>
            <div className={style.listEntry}>
              <p className={style.listEntryName}>Best score</p>
              <p className={style.listText}>{bestScore}</p>
            </div>
          </div>
          <button className={style.userButton} onClick={handleOpenConfigureModal}>Configure information</button>
          {isConfigureModalOpen && 
          <Configure 
            user={authorizedUser}
            onClose={handleConfigureModalClose} 
          />}
        </div>
      </div>
      <div className={style.profilesContainer}>
        <h2 className={style.header}>Game Profiles</h2>
        <div className={style.profiles}>
          {[0, 1, 2].map((profileNumber) => (
            <div key={profileNumber} className={style.profile}>
              <button 
                className={style.profileButton}
                onClick={() => toggleProfile(profileNumber)}>
                Profile {profileNumber + 1}
              </button>
              {isProfileExpanded(profileNumber) && (
                <div className={style.selectedProfileContainer}>
                  <h3 className={style.profileInfo}>Profile {profileNumber + 1} configurations</h3>
                  <div className={style.profileInputContainer}>
                    <p className={style.profileInfo}>Current settings: {gameProfileSettings[profileNumber]?.difficultyName}</p>
                    <button 
                      className={style.profileInputButton}
                      onClick={() => handleOpenSelectSettingsModal(gameProfileSettings[profileNumber])}>
                      Change
                    </button>
                  </div>
                  <div className={style.profileInputContainer}>
                    <p className={style.profileInfo}>Current picture: {gameProfileImages[profileNumber]?.imageName}</p>
                    <button 
                      className={style.profileInputButton}
                      onClick={() => handleOpenSelectModal(gameProfileImages[profileNumber])}>
                      Change
                    </button>
                    {isSelectModalOpen &&
                    <Select
                      image={imageToChange}
                      onSave={handleSelectModalSave}
                      onClose={handleSelectModalClose}
                    />}
                    {isSelectSettingsModalOpen &&
                    <SelectSettings
                      setting={settingsToChange}
                      onSave={handleSelectSettingsModalSave}
                      onClose={handleSelectSettingsModalClose}
                    />}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className={style.imagesContainer}>
        <h2 className={style.header}>Game Images</h2>
        <div className={style.imagesCollumns}>
          <div className={style.uploadContainer}>
            <h2 className={style.uploadText}>Upload Images</h2>
            <p className={style.uploadText}>Number of uploaded images: {authorizedUser.picturesCount}</p>
            <button 
              className={style.imagesButton}
              onClick={handleImageUpload}>
              Upload new image
            </button>
            <input
              type="file"
              accept=".png"
              onChange={handleFileSelect}
              className={style.uploadInput}
              ref={fileInputRef}
            />
          {cropperItem && (
            <CropperModal
              image={cropperItem}
              onSave={handleCropSave}
              onClose={handleCroplClose}
            />
          )}
          {previewItem && (
            <Preview
              image={previewItem}
              defaultButton={'Normal'}
              onSave={handleSavePreviewModal}
              onClose={handleClosePreviewModal} 
            />
          )}
          </div>
          <div className={style.exampleContainer}>
            <h2 className={style.uploadText}>Image example</h2>
            <div className={style.exampleContentContainer}>
              <div className={style.exampleImage}>
                <ImageNext
                  src="/upload_image.png"
                  height={150}
                  width={400}
                  alt="Upload example image"
                />
              </div>
              <ul className={style.listExample}>Images should follow 4 simple rules:
                <li className={style.listExampleEntry}>Ensure each segment looks distinctive</li>
                <li className={style.listExampleEntry}>Maintain good image quality</li>
                <li className={style.listExampleEntry}>Use the PNG image format</li>
                <li className={style.listExampleEntry}>Width and height is above 100 pixels</li>
              </ul>
            </div>
          </div>
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

export default Profile;