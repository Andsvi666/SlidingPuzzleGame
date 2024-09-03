'use client'

import React, { useState, useEffect } from 'react';
import style from './page.module.css';
import Table from '@/components/table/Table';
import Edit from '@/components/editModal/EditModal';
import Delete from '@/components/deleteModal/DeleteModal';
import AlertModal from '@/components/alertModal/AlertModal';
import {getTableData} from '@/utils/databaseActions'
import {editEntry} from '@/utils/databaseActions'
import {insertEntry} from '@/utils/databaseActions'
import {selectEntry} from '@/utils/databaseActions'
import { hashPassword } from '@/utils/databaseActions';
import cookie from 'js-cookie'

//Headers used to format a table
const tableHeaders = [
  { category: 'id', label: 'ID' },
  { category: 'username', label: 'Username' },
  { category: 'type', label: 'Type' },
  { category: 'registrationDate', label: 'Registered at' },
  { category: 'picturesCount', label: 'Uploaded Pictures' },
];

//fields are for edit modal just without ID
const fields = [
  { category: 'username', label: 'Username' },
  { category: 'password', label: 'Password(- to skip)' },
  { category: 'type', label: 'Type' },
];

const Pages = () => {
  const [authorizedUser, setAuthorizedUser] = useState();
  const [users, setUsers] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [previousPassword, setPreviousPassword] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
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
    async function fetchUsers() {
      const data = await getTableData('user_profiles', {
        user_types: true});
      const filteredData = data.filter((user) => user.id !== 1);
      const formattedData = filteredData.map((segment) => ({
        ...segment,
        registrationDate: new Date(segment.registrationDate).toLocaleString('lt-LT', {
          timeZone: 'UTC',
          hour12: false,
        }),
        type: segment.user_types?.usertype,
      }));
      setUsers(formattedData);
    }
    fetchUsers();
  }, []);


  //Function for edit button, return item from table componenet
  const handleEdit =(item) => {
    setEditItem(item);
    setPreviousPassword(item.password)
  };

  //saves data after editing it at editModal
  const handleDataSaving =  async  (editedEntry) => {
    const validUserTypes = ['standart', 'premium', 'admin'];
    const minUsernameLength = 6;
    const maxUsernameLength = 20;
    const allUsernames = users
      .filter(user => user.id !== editItem.id) 
      .map(user => user.username);

    const correctPassword = await getCorrectPassword(editedEntry.password)
    
    if(correctPassword != null)
    {
      if (
        editedEntry.username === "" ||
        /\s/.test(editedEntry.username) ||
        editedEntry.type === "" ||  
        /\s/.test(editedEntry.type)    
      ){
        setAlertText('All fields must be filled and without spaces');
        return;
      }
      if(editedEntry.username.length < minUsernameLength ||
        editedEntry.username.length > maxUsernameLength
      ){
        setAlertText('Username must be between 6 and 20 symbols');
        return;
      }
      if(validUserTypes.includes(editedEntry.type.toLowerCase())) {
        editedEntry.type = validUserTypes.indexOf(editedEntry.type.toLowerCase()) + 1;
      }else{
        setAlertText('Entry field "Type" must be "standart", "premium" or "admin"');
        return;
      }
      if(!allUsernames.includes(editedEntry.username)){
        const serverLog = {
          logText: `User ${authorizedUser.username} edited entry ${editItem.id} ID data in user_profiles table`,
          user: authorizedUser.id,
          type: 4,
        }
        insertEntry('server_logs', serverLog)
        const entryData = { username: editedEntry.username, password: correctPassword, type: editedEntry.type };
        editEntry('user_profiles', editItem.id, entryData);
        setAlertText("Entry edited successfully");
        setState(true);
        setEditItem(null);
      }else{
        setAlertText('Entry field "Username" must be unique. This username is already taken');
        return;
      }
    }
  }

// Returns correct password value depending on what was typed
const getCorrectPassword = async (value) => {
  const minPasswordLength = 8;
  const maxPasswordLength = 18;

  if (value === '-') {
    return previousPassword;
  } else {
    if(value === "" || 
    /\s/.test(value)){
      setAlertText('Password field must be filled and without spaces');
      return null;
    }
    if(value.length < minPasswordLength ||
      value.length > maxPasswordLength
    ){
      setAlertText('Password must be between 8 and 18 symbols');
      return null;
    }  
    try {
      const hashedPassword = await hashPassword(value);
      return hashedPassword;
    } catch (error) {
      setAlertText('Error hashing password');
      return null;
    }
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
      <h1 className={style.header}>Manage User profiles</h1>
      <Table
        data={users}
        shouldReset={false}
        tableHeaders={tableHeaders}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
          table={'user_profiles'}
          onClose={handleCloseDeleteModal}  
          user={authorizedUser}
          author={null}
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

export default Pages;