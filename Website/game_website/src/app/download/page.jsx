'use client'

import React, { useState, useEffect } from 'react';
import style from './page.module.css';
import cookie from 'js-cookie'

const Download = () => {  
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

  if (!renderPage) {
    return; 
  }

  //Selects file to download
  const handleDownload = () => {
    const filePath = '/SlidingPuzzle.zip';
    const downloadLink = document.createElement('a');
    downloadLink.href = filePath;
    downloadLink.download = filePath.split('/').pop();
    downloadLink.click();
  };

  return (
    <div className={style.container}>
      <div className={style.infoContainer}>
        <div className={`${style.contentContainer} ${style.instructions}`}>
          <h2 className={style.header}>Instructions</h2>
          <p className={style.parag}>
            To download the game, click the "Download" button below. 
            Once the .zip file is downloaded, extract it to the folder 
            where you want to keep your game. Inside that folder, 
            locate the file named "SlidingPuzzle.exe" and double-click 
            it to play the game. No installation is required.
          </p>
        </div>
        <div className={`${style.contentContainer} ${style.requirements}`}>
          <h2 className={style.header}>Requirements</h2>
          <div className={style.parag}>
              <ul className={style.list}>
                <li className={style.listEntry}>Operating System: Linux,
                 Windows, or MacOS are all supported.</li>
                <li className={style.listEntry}>Processor: A modern 
                dual-core or higher processor is recommended for optimal
                 performance.</li>
                <li className={style.listEntry}>Memory (RAM): To ensure 
                smooth gameplay, a minimum of 2 GB of RAM is required.</li>
                <li className={style.listEntry}>Graphics Card: While the 
                game does not demand a dedicated graphics card, a standard 
                integrated GPU should suffice.</li>
                <li className={style.listEntry}>Disk Space: You must have 
                at least 500 megabytes of free disk space to install and 
                run the game.</li>
              </ul>
            </div>
        </div>
      </div>
      <div className={style.downloadContainer}>
        <button className={style.button}  onClick={handleDownload}>
          DOWNLOAD
        </button>
        <p className={style.downloadInfo}>Version 1.0 (beta)</p>
      </div>
    </div>
  );
};

export default Download;