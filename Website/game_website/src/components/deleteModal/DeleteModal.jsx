import React, { useState } from 'react';
import styles from './deleteModal.module.css';
import AlertModal from '@/components/alertModal/AlertModal';
import {deleteEntry} from '@/utils/databaseActions';
import {deleteImage} from '@/utils/fileActions';
import {insertEntry} from '@/utils/databaseActions';
import {editEntry} from '@/utils/databaseActions';

const deleteModal = ({table, entry, onClose, user, author}) => {
  const [alertText, setAlertText] = useState(null);
  const [state, setState] = useState(false)

  //Deletes item when button yes is clicked
  const handleDelete = () => {
    if(table === 'images'){
      console.log(entry.id)
      if(entry.id === 1){
        setAlertText('this is default image, it cannot be deleted');
        return
      }
      editEntry('user_profiles', author.id, {picturesCount:author.picturesCount - 1})
      deleteImage(entry.imageName)
    }
    deleteEntry(table, entry.id)
    const serverLog = {
      logText: `User ${user.username} deleted entry ${entry.id} ID from ${table} table`,
      user: user.id,
      type: 4,
    }
    insertEntry('server_logs', serverLog)
    setAlertText('entry deleted successfully');
    setState(true)
  };

  //sets alert text to null
  const handleCloseAlertModal = () => {
    setAlertText(null)
    onClose();
    if(state){
      window.location.reload()
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <h3>Are you sure you want to delete this entry?</h3>
        <div className={styles.buttons}>
          <button className={styles.button} onClick={handleDelete}>Yes</button>
          <button className={styles.button} onClick={onClose}>No</button>
        </div>
      </div>
      {alertText && (
        <AlertModal
        text = {alertText}
        onClose = {handleCloseAlertModal}
      />
      )}
    </div>
  )
}

export default deleteModal