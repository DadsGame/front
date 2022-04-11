import React from "react";
import styles from '../styles/Home.module.css'

const GameCard = ({...props}) => {
    return (
        <div className={styles.cardContainer}>
            <div className={styles.card}>
                <img src="https://images.igdb.com/igdb/image/upload/t_cover_big/co1tnw.png" className={styles['card-img']} alt="" />
                <div className={styles['card-body']}>
                    <h2 className={styles.name}> {props.game.name} </h2>
                    <h6 className={styles.desc}> {props.game.description}</h6>
                </div>
            </div>
        </div>
    );
}

export default GameCard;
