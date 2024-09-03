'use client'

import React, { useState, useEffect } from 'react';
import style from './page.module.css';
import Table from '@/components/table/Table';
import Preview from '@/components/previewModal/PreviewModal';
import {getTableData} from '@/utils/databaseActions'
import cookie from 'js-cookie'

//Headers used to format table
const tableHeaders = [
  { category: 'id', label: 'ID' },
  { category: 'time', label: 'Seconds' },
  { category: 'score', label: 'Points' },
  { category: 'player', label: 'Player' },
  { category: 'image', label: 'Image' },
  { category: 'settings', label: 'Settings' },
  { category: 'resultsDate', label: 'Finished at' },
];

const Leaderboard = () => {
  const [scoresNormal, setScoresNormal] = useState([]);
  const [scoresChallenge, setScoresChallenge] = useState([]);
  const [buttonText, setButtonText] = useState('Show Challenge Mode Highscores');
  const [selectedType, setSelectedType] = useState('type1');
  const [resetTable, setResetTable] = useState(true);
  const [previewItem, setPreviewItem] = useState(null);
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
    async function fetchResults() {
      const data = await getTableData('game_results', {
        user_profiles: true,
        images: true,
        game_settings: true,
      });
      const formattedData = data.map((segment) => ({
        ...segment,
        isChallangeMode: segment.isChallangeMode === true ? 'Challenge' : 'Normal',
        resultsDate: new Date(segment.resultsDate).toLocaleString('lt-LT', {
          timeZone: 'UTC',
          hour12: false,
        }),
        player: segment.user_profiles?.username,
        image: segment.images?.imageName,
        settings: segment.game_settings?.difficultyName,

      }));
      handleDataDivision(formattedData);
    }
    fetchResults();
  }, []);


  //Divide data between Challenge and normal mode
  const handleDataDivision = (allScores) => {
    const normalScores = allScores.filter((score) => score.isChallangeMode === 'Normal');
    const challengeScores = allScores.filter((score) => score.isChallangeMode === 'Challenge');
    normalScores.sort((a, b) => b.score - a.score);
    challengeScores.sort((a, b) => b.score - a.score);
    setScoresNormal(normalScores);
    setScoresChallenge(challengeScores);
  };

  //switches table types by getting the current table type value
  const handleTypeChange = (type) => {
    if(type === 'type1')
    {
      setSelectedType('type2');
      setButtonText('Show Normal Mode Highscores')
    }
    else
    {
      setSelectedType('type1');
      setButtonText('Show Challenge Mode Highscores')
    }
    setResetTable(true);
  };

  //once consts is changed to true it does reset it
  useEffect(() => {
    if (resetTable) {
      setResetTable(false);
    }
  }, [resetTable]);


  //Function for preview button, return item from table componenet and extract image name
  const handlePreview = (item) => {
    setPreviewItem(item);
  };

  //removed selected preview item and image when modal is closed
  const handleClosePreviewModal = () => {
    setPreviewItem(null); 
  };

  if (!renderPage) {
    return; 
  }

  return (
    <div className={style.container}>
      <button
        className={style.switchButton}
        onClick={() => handleTypeChange(selectedType)}
      >
        {buttonText}
      </button>
      <h2 className={style.header}>{selectedType === 'type1' ? 'Normal Mode Highscores' : 'Challenge Mode Highscores'}</h2>
      <Table
        data={selectedType === 'type1' ? scoresNormal : scoresChallenge}
        shouldReset={resetTable}
        tableHeaders={tableHeaders}
        onEdit={null}
        onDelete={null}
        onPreview={handlePreview}
      />
      {previewItem && (
        <Preview
          image={previewItem.image}
          defaultButton={previewItem.settings} 
          onSave={false}
          onClose={handleClosePreviewModal} 
        />
      )}
    </div>
  );
};

export default Leaderboard;