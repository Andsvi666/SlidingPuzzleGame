'use client'

import React, { useState, useEffect } from 'react';
import style from './page.module.css';
import Link from 'next/link';
import cookie from 'js-cookie';

//checks if correct user accesses the page
const ck = cookie.get('currentUser');
if(ck === undefined){
  window.location.href = '/';
}else if(ck[2] !== '3'){
  window.location.href = '/';
}

const Administration = () => {
  const [renderPage, setRenderPage] = useState(false);

  // Checks if correct user accesses the page
  useEffect(() => {
    const ck = cookie.get('currentUser');
    if (ck === undefined) {
      window.location.href = '/';
    } else if(ck[2] !== '3'){
      window.location.href = '/';
    } else {
      setRenderPage(true);
    }
  }, []);
  
  if (!renderPage) {
    return; 
  }
  
  return (
    <div className={style.container}>
      <Link
        href="/administration/logs"
        className={style.logPanel}
      >
        <h3 className={style.logHeader}>
          View Server Logs
        </h3>
      </Link>
      <div className={style.managmentContainer}>
        <Link 
          href="/administration/users"
          className={style.panel}>
            <h3 className={style.header}>
              Manage Users
            </h3>
            <div className={style.box}>
              <ul className={style.list}>
                <li className={style.listEntry}>Ban users</li>
                <li className={style.listEntry}>Change users type</li>
                <li className={style.listEntry}>Edit other info</li>
              </ul>
            </div>
        </Link>
        <Link 
          href="/administration/images"
          className={style.panel}>
            <h3 className={style.header}>
              Manage Images
            </h3>
            <div className={style.box}>
              <ul className={style.list}>
                <li className={style.listEntry}>Remove images</li>
                <li className={style.listEntry}>Approve images</li>
                <li className={style.listEntry}>Change authors</li>
              </ul>
            </div>
        </Link>
        <Link 
          href="/administration/results"
          className={style.panel}>
            <h3 className={style.header}>
              Manage Results
            </h3>
            <div className={style.box}>
              <ul className={style.list}>
                <li className={style.listEntry}>Remove results</li>
                <li className={style.listEntry}>Edit results</li>
              </ul>
            </div>
        </Link>
      </div>
    </div>
  );
};

export default Administration;