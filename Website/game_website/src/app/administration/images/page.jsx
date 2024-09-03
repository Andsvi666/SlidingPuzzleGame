'use client'

import React, { useState, useEffect } from 'react';
import style from './page.module.css';
import Table from '@/components/table/Table';
import Edit from '@/components/editModal/EditModal';
import Delete from '@/components/deleteModal/DeleteModal';
import Preview from '@/components/previewModal/PreviewModal';
import AlertModal from '@/components/alertModal/AlertModal';
import {getTableData} from '@/utils/databaseActions';
import {editEntry} from '@/utils/databaseActions';
import {renameImage} from '@/utils/fileActions';
import {insertEntry} from '@/utils/databaseActions';
import {selectEntry} from '@/utils/databaseActions';
import cookie from 'js-cookie';

//Headers used to format a table
const tableHeaders = [
  { category: 'id', label: 'ID' },
  { category: 'imageName', label: 'Name' },
  { category: 'isApproved', label: 'Approved' },
  { category: 'userAuthor', label: 'Author' },
  { category: 'uploadDate', label: 'Uploaded at' },
];

//fields are for edit modal
const fields = [
  { category: 'imageName', label: 'Name' },
  { category: 'isApproved', label: 'Approved(yes/no)' },
];

const Images = () => {
  const [authorizedUser, setAuthorizedUser] = useState();
  const [images, setImages] = useState([]);
  const [users, setUsers] = useState([]);
  const [state, setState] = useState(false);
  const [author, setAuthor] = useState('')
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [alertText, setAlertText] = useState(null);
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
    async function fetchImages() {
      const data = await getTableData('images', {
        user_profiles: true,});
      const formattedData = data.map((segment) => ({
        ...segment,
        isApproved: segment.isApproved === true ? 'Yes' : 'No',
        uploadDate: new Date(segment.uploadDate).toLocaleString('lt-LT', {
          timeZone: 'UTC',
          hour12: false,
        }),
        userAuthor: segment.user_profiles?.username,
      }));
      setUsers(data.map(entry => entry.user_profiles));
      setImages(formattedData);
    }

    fetchImages();
  }, []);


  //Function for edit button, return item from table componenet
  const handleEdit = (item) => {
    setEditItem(item);
  };

  //saves data after editing it at editModal
  const handleDataSaving = (editedEntry) => {
    const allnames = images
      .filter(image => image.id !== editItem.id) 
      .map(image => image.imageName);
    editedEntry.imageName = editedEntry.imageName.toLowerCase()
    if (
      editedEntry.imageName === "" ||
      editedEntry.isApproved === ""  
    ){
      setAlertText('All fields must be filled');
      return;
    }
    if (editedEntry.isApproved.toLowerCase() === 'yes') {
      editedEntry.isApproved = true;
    } else if (editedEntry.isApproved.toLowerCase() === 'no') {
      editedEntry.isApproved = false;
    } else {
      setAlertText('Edited entry "Approved" value must be "yes" or "no"');
      return;
    }
    if(allnames.includes(editedEntry.imageName)){
      setAlertText('Edited entry name is already in use');
      return;
    }
    if (editItem.imageName !== editedEntry.imageName) {
      renameImage(editItem.imageName, editedEntry.imageName);
    }
    const serverLog = {
      logText: `User ${authorizedUser.username} edited entry ${editItem.id} ID data in images table`,
      user: authorizedUser.id,
      type: 4,
    }
    insertEntry('server_logs', serverLog)
    const entryData = { imageName: editedEntry.imageName, isApproved: editedEntry.isApproved };
    editEntry('images', editItem.id, entryData);
    setAlertText("Entry edited successfully");
    setState(true)
    setEditItem(null);
  }

  //removed selected edit item when modal is closed
  const handleCloseEditModal = () => {
    setEditItem(null);
  };

  //Function for delete button, return item from table componenet
  const handleDelete = (item) => {
    users.map(user =>{
      if(user.username === item.userAuthor){
        setAuthor(user);
      }
    });
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
      <h1 className={style.header}>Manage Images</h1>
      <Table
        data={images}
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
          table={'images'}
          onClose={handleCloseDeleteModal} 
          user={authorizedUser}
          author={author}
        />
      )}
      {previewItem && (
        <Preview
          image={previewItem.imageName}
          defaultButton={'Normal'}
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

export default Images;