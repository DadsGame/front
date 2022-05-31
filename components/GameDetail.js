import {React} from "react";

import styles from '../styles/Details.module.css';
import GenericCard from "./GenericCard.js";
import useBreakpoint from "../hooks/useBreakpoint";

const GameDetail = ({game}) => {
    console.log(game)
    const {breakPointName} = useBreakpoint()
    return (
        <GenericCard>
            <div>
                <div className={styles[`details-container-${breakPointName}`]}>
                    <div className={styles[`details-image-container`]}>
                        <img className={styles['game-detail-img']} src={game.cover}/>
                    </div>


                        <div className={styles['game-detail-title']}>
                            {JSON.stringify(game.name).replaceAll('"', '')}
                        </div>
                        <div className={styles['game-detail-score']}>
                            {JSON.stringify(game.aggregated_rating)}%
                        </div>


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