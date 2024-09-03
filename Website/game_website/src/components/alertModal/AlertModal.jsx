import React from 'react'
import styles from './alertModal.module.css';

const alertModal = ({text, onClose}) => {

  return (
    <div className={styles.container}>
        <div className={styles.contentContainer}>
            <h3 className={styles.header}>{text}</h3>
            <button className={styles.button} onClick={onClose}>OK</button>
        </div>
    </div>
  )
}

export default alertModal