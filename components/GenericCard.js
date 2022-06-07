import React from 'react';
import styles from '../styles/GenericCard.module.css';

const GenericCard = ({ children, style }) => {
  return (
    <div className={styles.container} style={style}>
      {children}
    </div>
  );
};

export default GenericCard;
