import React, { useState, useEffect } from 'react';
import styles from './editModal.module.css';

const EditModal = ({ entry, fields, onClose, onSave }) => {
  const { id, ...editedEntry } = entry;
  const [editedEntryState, setEditedEntryState] = useState(editedEntry);

  //Sets given entry with ID removed
  useEffect(() => {
    const { id, ...rest } = entry;
    if(entry.password !== undefined){
      entry.password = "-";
    }
    setEditedEntryState(rest);   
  }, [entry]);

  //Saves entry when any live change is made
  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedEntryState((preventry) => ({
      ...preventry,
      [name]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.modalContent}>
        <h2 className={styles.header}>Edit entry</h2>
        {fields.map(field => (
          <div className={styles.formGroup} key={field.category}>
            <label className={styles.label} htmlFor={field.category}>{field.label}:</label>
            <input
              className={styles.input}
              type="text"
              id={field.category}
              name={field.category}
              value={editedEntryState[field.category] || ''}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className={styles.buttons}>
        <button className={styles.button} onClick={() => onSave(editedEntryState)}>Save</button>
          <button className={styles.button} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;