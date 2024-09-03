'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import styles from './navbar.module.css'
import cookie from 'js-cookie'
import {insertEntry} from '@/utils/databaseActions'
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  const [username, setUsername] = useState()
  const [userId, setUserId] = useState(0)
  const [logoutTabClass, setLogoutTabClass] = useState('tabBlocked')
  const [loginTabClass, setLoginTabClass] = useState('tabBlocked')
  const [loggedTabClass, setLoggedTabClass] = useState('tabBlocked')
  const [adminTabClass, setAdminTabClass] = useState('tabBlocked')

  //Fetches user type from cookies
  const handleUserType = () => {
    const data = cookie.get('currentUser');
    if(data !== undefined){
      const dataArray = data.split(' ');
      const userId = parseInt(dataArray[0]);
      const userType = parseInt(dataArray[1]);
      const username = dataArray[2];
      handleLinks(userType);
      setUserId(userId);
      setUsername(username);
    }else{
      handleLinks(0)
    }
  }

  //call the function
  useEffect(() => {
    handleUserType();
  }, []); 

  //generates tab links by user type
  const handleLinks = (userType) =>{
    if(userType == 0){
      setLogoutTabClass('tabBlocked')
      setLoginTabClass('tabActive')
      setLoggedTabClass('tabBlocked')
      setAdminTabClass('tabBlocked')
    }
    if(userType == 1 || userType == 2){
      setLogoutTabClass('tabActive')
      setLoginTabClass('tabBlocked')
      setLoggedTabClass('tabActive')
      setAdminTabClass('tabBlocked')
    }
    if(userType == 3){
      setLogoutTabClass('tabActive')
      setLoginTabClass('tabBlocked')
      setLoggedTabClass('tabActive')
      setAdminTabClass('adminActive')
    }
  }

  //removes cookie when logout is clicked
  const handleLogout = () => {
    if(userId !== 0){
      const serverLog = {
        logText: `User ${username} logged out from website`,
        user: userId,
        type: 1,
      }
      insertEntry('server_logs', serverLog)
    }
    cookie.remove('currentUser');
    window.location.reload()
  };

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.content}>
        <Link href="/" className={styles.home}>
          Sliding Puzzle
        </Link>
        <div className={styles.tabs}>
          <div className={`${styles.dropdown} ${styles[adminTabClass]}`}>
            <Link 
              href="/administration" 
              className={styles.dropbtn}>
              Administration
            </Link>
            <div className={styles.dropdownContent}>
              <Link 
                href="/administration/users">
                Manage Users
              </Link>
              <Link 
                href="/administration/images">
                Manage Images
              </Link>
              <Link 
                href="/administration/results">
                Manage Results
              </Link>
              <Link 
                href="/administration/logs">
                See Logs
              </Link>
            </div>
          </div>
          <Link 
            href="/" 
            className={styles.tab}>
            Home
          </Link>
          <Link 
            href="/info" 
            className={styles.tab}>
            Info
          </Link>
          <Link 
            href="/leaderboard" 
            className={`${styles.tab} ${styles[loggedTabClass]}`}>
            Leaderboard
          </Link>
          <Link 
            href="/download" 
            className={`${styles.tab} ${styles[loggedTabClass]}`}>
            Download
          </Link>
          <Link 
            href="/profile" 
            className={`${styles.tab} ${styles[loggedTabClass]}`}>
            Configure
          </Link>
          <Link 
            href="/login" 
            className={`${styles.tab} ${styles[loginTabClass]}`}>
            Login
          </Link>
          <div 
            className={`${styles.tab} ${styles[logoutTabClass]}`}
            onClick={handleLogout}
          >
            <Link 
              className={styles.tab}
              href="/">
              Logout
            </Link>
          </div>
          <div 
            className={`${styles.welcome} ${styles[loggedTabClass]}`}>
            <FaUser className={styles.icon}/>
            {username}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar