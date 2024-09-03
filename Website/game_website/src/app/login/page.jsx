'use client'

import React, { useState, useEffect } from 'react';
import style from './page.module.css';
import Link from 'next/link';
import {getTableData} from '@/utils/databaseActions'
import {insertEntry} from '@/utils/databaseActions'
import { checkPassword } from '@/utils/databaseActions';
import AlertModal from '@/components/alertModal/AlertModal';
import cookie from 'js-cookie'


const Login = () => {
  const [allUsers, setAllUsers] = useState()
  const [state, setState] = useState(false)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        setAllUsers(data);
    }
    fetchUsers();
  }, []);

  //function to handle login
  const handleLogin = async () => {
    const foundUser = allUsers.find(user => user.username === username);
    if (foundUser) {

      const checkPass = await checkPassword(password, foundUser.password)
      if (checkPass) {
        setUsername('');
        setPassword('');
        const serverLog = {
          logText: `User ${username} logged in to the website`,
          user: foundUser.id,
          type: 1,
        };
        insertEntry('server_logs', serverLog);
        const currentUser = [foundUser.id + ' ' + foundUser.type + ' ' + foundUser.username];
        cookie.set('currentUser', currentUser);
        setState(true);
        setAlertText('Login successful');
      } else {
        setAlertText('Wrong password');
      }
    }else{
      setAlertText('No user with this username');
    }
  };


  //sets alert text to null
  const handleCloseAlertModal = () => {
    setAlertText(null)
    if(state){
      window.location.href = '/';
    }
  };
  
  if (!renderPage) {
    return; 
  }

  return (
    <div className={style.container}>
      <div className={style.box}>
        <h1 className={style.header}>Please Log In</h1>
        <div className={style.loginBox}>
          <div className={style.entryBox}>
            <label 
              className={style.label} 
              htmlFor="username">
              Username
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
          <label 
              className={style.label} 
              htmlFor="password">
              Password
            </label>
            <input
              className={style.input} 
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button 
          className={style.login}
          onClick={handleLogin}>
          Login
        </button>
        <div className={style.registerBox}>
          <Link
            className={style.registerLink}
            href={"/login/register"}
          >
            Don't have account? Register here
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

export default Login;