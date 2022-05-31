import {React} from "react";

import styles from '../styles/Details.module.css';
import GenericCard from "./GenericCard.js";

const GameDetail = ({game}) => {
    console.log(game)
    return (
        <GenericCard>
            <div>
                <div className={styles['details-container']}>
                    <img className={styles['game-detail-img']} src={game.cover}/>
                    <ul>
                        <div className={styles['game-detail-title']}>
                            {JSON.stringify(game.name).replaceAll('"', '')}
                        </div>
                        <div className={styles['game-detail-score']}>
                            {JSON.stringify(game.aggregated_rating)}%
                        </div>
                    </ul>

                </div>
                <div className={styles['game-detail-summary']}>
                    {JSON.stringify(game.summary).replaceAll('"', '')}
                </div>
                <div className={styles['game-detail-storyline']}>
                    {JSON.stringify(game.storyline)}
                </div>
            </div>
        </GenericCard>
    )

};

export default GameDetail;