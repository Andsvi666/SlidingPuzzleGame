'use client'

import React, { useState, useEffect } from 'react';
import style from './page.module.css';
import Link from 'next/link';
import AlertModal from '@/components/alertModal/AlertModal';
import {getTableData} from '@/utils/databaseActions'
import {insertEntry} from '@/utils/databaseActions'
import { hashPassword } from '@/utils/databaseActions';
import cookie from 'js-cookie'

const Register = () => {
  const [allUsernames, setAllUsernames] = useState([])
  const [state, setState] = useState(false)
  const [lastId, setLastId] = useState()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertText, setAlertText] = useState(null);
  const [renderPage, setRenderPage] = useState(false);

  // Checks if correct user accesses the page
  useEffect(() => {
    const ck = cookie.get('currentUser');
    if (ck !== undefined) {
      window.location.href = '/';
    } else {
      setRenderPage(true);
    }
  }, []);
  
  //Fetches data from database
  useEffect(() => {
    async function fetchUsers() {
      const data = await getTableData('user_profiles', {
        user_types: true});
        setAllUsernames(data.map(user => user.username));
        setLastId(data[data.length - 1].id);
    }
    fetchUsers();
  }, []);

  //handles registration
  const handleRegistration = async () =>{
    const minUsernameLength = 6;
    const maxUsernameLength = 20;
    const minPasswordLength = 8;
    const maxPasswordLength = 18;
    if (
      username !== "" &&
      !/\s/.test(username) &&
      password !== "" && 
      !/\s/.test(password) &&
      confirmPassword !== "" &&   
      !/\s/.test(confirmPassword)    
    ){
      if(username.length >= minUsernameLength &&
        username.length <= maxUsernameLength){
          if(password.length >= minPasswordLength &&
            password.length <= maxPasswordLength &&
            confirmPassword.length >= minPasswordLength &&
            confirmPassword.length <= maxPasswordLength){
              if(!allUsernames.includes(username)){
                if(password === confirmPassword){
                  try{
                    const hashedPassword = await hashPassword(password);
                    const newUserData = {
                      id: lastId + 1,
                      username: username,
                      password: hashedPassword,
                      type: 1,
                      picturesCount: 0,
                    }
                    const newGameProfile = {
                      user: lastId + 1,
                      selectedImage: 1,
                      selectedSettings: 1,
                    }
                    const serverLog = {
                      logText: `New user ${username} registered at website`,
                      user: lastId + 1,
                      type: 1,
                    }
                    insertEntry('user_profiles', newUserData)
                    insertEntry('game_profiles', newGameProfile)
                    insertEntry('game_profiles', newGameProfile)
                    insertEntry('game_profiles', newGameProfile)
                    insertEntry('server_logs', serverLog)
                    setUsername('')
                    setPassword('')
                    setConfirmPassword('')
                    setState(true)
                    setAlertText('Registration complete')
                  } catch (error) {
                    setAlertText('Error hashing password');
                  }
                }else{
                  setAlertText('Passwords do not match')
                }
              }else{
                setAlertText('This username is already in use')
              }
            }else{
              setAlertText('Password must be between 8 and 18 symbols')
            }
        }else{
          setAlertText('Username must be between 6 and 20 symbols')
        }
    }else{
      setAlertText('All fields must be filled and without spaces')
    }
  }

  //sets alert text to null
  const handleCloseAlertModal = () => {
    setAlertText(null)
    if(state){
      window.location.href = '/login';
    }
  };

  if (!renderPage) {
    return; 
  }

  return (
    <div className={style.container}>
      <div className={style.box}>
        <h1 className={style.header}>Register</h1>
        <div className={style.registerBox}>
          <div className={style.entryBox}>
            <label className={style.mainLabel} htmlFor="username">
              Username
            </label>
            <label className={style.label} htmlFor="usernameWarning">
              (6-20 characters long)
            </label>
            <input
              className={style.input}
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={style.entryBox}>
            <label className={style.mainLabel} htmlFor="password">
              Password
            </label>
            <label className={style.label} htmlFor="passwordWarning">
              (8-18 characters long)
            </label>
            <input
              className={style.input}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={style.entryBox}>
            <label className={style.mainLabel} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className={style.input}
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <button 
          className={style.login}
          onClick={handleRegistration}>
          Register
        </button>
        <div className={style.loginBox}>
          <Link className={style.loginLink} href="/login">
            Already have an account? Log in here
          </Link>
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

export default Register;