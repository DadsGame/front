import React from 'react';
import styles from '../styles/GenericCard.module.css';

const GenericCard = ({children}) => {

    return(
        <div className={styles.container}>
            {children}
        </div>
    )

};

export default GenericCard;