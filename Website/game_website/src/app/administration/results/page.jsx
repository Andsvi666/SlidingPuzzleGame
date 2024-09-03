'use client'

import React, { useState, useEffect } from 'react';
import style from './page.module.css';
import Table from '@/components/table/Table';
import Edit from '@/components/editModal/EditModal';
import Delete from '@/components/deleteModal/DeleteModal';
import Preview from '@/components/previewModal/PreviewModal';
import AlertModal from '@/components/alertModal/AlertModal';
import {getTableData} from '@/utils/databaseActions'
import {editEntry} from '@/utils/databaseActions'
import {insertEntry} from '@/utils/databaseActions'
import {selectEntry} from '@/utils/databaseActions'
import cookie from 'js-cookie'

//Headers used to format a table
const tableHeaders = [
  { category: 'id', label: 'ID' },
  { category: 'time', label: 'Seconds' },
  { category: 'score', label: 'Points' },
  { category: 'isChallangeMode', label: 'Mode' },
  { category: 'player', label: 'Player' },
  { category: 'image', label: 'Image' },
  { category: 'settings', label: 'Settings' },
  { category: 'resultsDate', label: 'Finished at' },
];

//fields are for edit modal just without ID
const fields = [
  { category: 'time', label: 'Seconds' },
  { category: 'score', label: 'Points' },
];

const Results = () => {
  const [authorizedUser, setAuthorizedUser] = useState();
  const [results, setResults] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [alertText, setAlertText] = useState(null);
  const [state, setState] = useState(false);
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

  //Fetches current user from database
  useEffect(() => {
  async function fetchUser() {
    const ck = cookie.get('currentUser');
    const data = await selectEntry('user_profiles', parseInt(ck[0]));
    setAuthorizedUser(data);
  }
  fetchUser();
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
      setResults(formattedData);
    }
    fetchResults();
  }, []);

  //Function for edit button, return item from table componenet
  const handleEdit = (item) => {
    setEditItem(item);
  };

  //saves data after editing it at editModal
  const handleDataSaving = (editedEntry) => {
    if (
      editedEntry.time === "" ||
      editedEntry.score === ""  
    ){
      setAlertText('All fields must be filled');
      return;
    }
    const parsedTime = parseInt(editedEntry.time, 10);
    const parsedScore = parseInt(editedEntry.score, 10);
    if (!Number.isNaN(parsedTime) && parsedTime >= 0) {
      if(!Number.isNaN(parsedScore) && parsedScore >= 0){
        const serverLog = {
          logText: `User ${authorizedUser.username} edited entry ${editItem.id} ID data in game_results table`,
          user: authorizedUser.id,
          type: 4,
        }
        insertEntry('server_logs', serverLog)
        const entryData = { time: parsedTime, score: parsedScore };
        editEntry('game_results', editItem.id, entryData);
        setAlertText("Entry edited successfully");
        setState(true)
        setEditItem(null);
      } else {
        setAlertText('Entry field "Points" must be postive integer');
        return;
      }
    } else {
      setAlertText('Entry field "Seconds" must be postive integer');
      return;
    }
  };

  //removed selected edit item when modal is closed
  const handleCloseEditModal = () => {
    setEditItem(null);
  };
  

  //Function for delete button, return item from table componenet
  const handleDelete = (item) => {
    setDeleteItem(item)
  };

  //removed selected delete item when modal is closed
  const handleCloseDeleteModal = () => {
    setDeleteItem(null); 
  };

  //Function for preview button, return item from table componenet and extract image name
  const handlePreview = (item) => {
    setPreviewItem(item);
  };

  //removed selected preview item and image when modal is closed
  const handleClosePreviewModal = () => {
    setPreviewItem(null); 
  };

  //sets alert text to null
  const handleCloseAlertModal = () => {
    setAlertText(null)
    if(state){
      window.location.reload()
    }
  };

  if (!renderPage) {
    return; 
  }

  return (
    <div className={style.container}>
      <h1 className={style.header}>Manage Game Results</h1>
      <Table
        data={results}
        shouldReset={false}
        tableHeaders={tableHeaders}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPreview={handlePreview}
      />
      {editItem && (
        <Edit 
          entry={editItem} 
          fields={fields}
          onClose={handleCloseEditModal} 
          onSave={handleDataSaving}
        />
      )}
      {deleteItem && (
        <Delete
          entry={deleteItem} 
          table={'game_results'}
          onClose={handleCloseDeleteModal} 
          user={authorizedUser}
          author={null}
        />
      )}
      {previewItem && (
        <Preview
          image={previewItem.image} 
          defaultButton={previewItem.settings}
          onSave={false}
          onClose={handleClosePreviewModal} 
        />
      )}
      {alertText && (
        <AlertModal
        text = {alertText}
        onClose = {handleCloseAlertModal}
      />
      )}
    </div>
  );
};

export default Results;