'use client'

import React, { useState, useEffect } from 'react';
import styles from './configureModal.module.css';
import {editEntry} from '@/utils/databaseActions'
import {insertEntry} from '@/utils/databaseActions';
import {getTableData} from '@/utils/databaseActions';
import { hashPassword } from '@/utils/databaseActions';
import AlertModal from '@/components/alertModal/AlertModal';

const ConfigureModal = ({ user, onClose }) => {
  const [allUsernames, setAllUsernames] = useState([])
  const [newUsername, setNewUsername] = useState(user.username);
  const [newPassword, setNewPassword] = useState();
  const [alertText, setAlertText] = useState('');

  //Fetches data from database
  useEffect(() => {
    async function fetchData() {
      const users = await getTableData('user_profiles', {});
      setAllUsernames(users.map(user => user.username));
    }
    fetchData();
  }, []);

  //action to change username
  const handleUsernameChange = () => {
    const minUsernameLength = 6;
    const maxUsernameLength = 20;
    if (newUsername !== "" &&
      !/\s/.test(newUsername))
      {
      if(newUsername.length >= minUsernameLength &&
        newUsername.length <= maxUsernameLength){
          if(!allUsernames.includes(newUsername)){
            const serverLog = {
              logText: `User ${user.username} changed their username to ${newUsername}`,
              user: user.id,
              type: 2,
            }
            insertEntry('server_logs', serverLog)
            const newEntry = {
              username: newUsername,
            }
            editEntry('user_profiles', user.id, newEntry)
            setAlertText('Username changed succesfully')
          }else{
            setAlertText('This username is already in use')
          }
        }else{
          setAlertText('Username must be between 6 and 20 symbols')
        }
    }else{
      setAlertText('Username must be filled and without spaces')
    }
  };

  //action to change password
  const handlePasswordChange = async() => {
    const minPasswordLength = 8;
    const maxPasswordLength = 18;
    if (newPassword !== "" && 
      !/\s/.test(newPassword))
      {
      if(newPassword.length >= minPasswordLength &&
        newPassword.length <= maxPasswordLength)
        {
          try{
            const hashedPassword = await hashPassword(newPassword)
            const serverLog = {
              logText: `user ${user.username} changed their password`,
              user: user.id,
              type: 2,
            }
            insertEntry('server_logs', serverLog)
            const newEntry = {
              password: hashedPassword,
            }
            editEntry('user_profiles', user.id, newEntry)
            setNewPassword('');
            setAlertText('Password changed succesfully')
          }catch (error) {
            setAlertText('Error hashing password');
          }
      }else{
        setAlertText('Password must be between 8 and 18 symbols')
      }
    }else{
      setAlertText('All fields must be filled and without spaces')
    }
  };

  //sets alert text to null
  const handleCloseAlertModal = () => {
    setAlertText(null)
  };

  return (
    <div className={styles.container}>
      <div className={styles.modalContent}>
        <h3 className={styles.mainHeader}>Configure Information</h3>
        <div className={styles.inputContainer}>
            <p className={styles.type}>Username</p>
            <input
                className={styles.input}
                type="text"
                placeholder="New Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
            />
            <button 
                className={styles.button}
                onClick={handleUsernameChange}>
                Change Username
            </button>
        </div>
        <div className={styles.inputContainer}>
            <p className={styles.type}>Password</p>
            <input
                className={styles.input}
                type="text"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button 
                className={styles.button}
                onClick={handlePasswordChange}>
                Set New Password
            </button>
        </div>
        <button 
            className={styles.button} 
            onClick={onClose}>
            Close
        </button>
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

export default ConfigureModal;