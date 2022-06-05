import {React, useState} from "react";

import styles from '../styles/GameCard.module.css';
import {Backdrop, Box, Modal, Skeleton, Typography} from "@mui/material";
import useBreakpoint from "../hooks/useBreakpoint.js";
import {useRouter} from "next/router";

const GameCard = ({cover, score, title, scoreColor = '#fff', id}) => {

    const {breakPointName, width, height} = useBreakpoint();
    const router = useRouter();
    const idGame = id;
    const skeleton = (cover == null || score == null || id == null);

    // TODO: Put the formatter in i18n lib when dealing with translation
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'percent',
        maximumFractionDigits: 0
    });

    return breakPointName === 'large' ? _renderBig() : _renderSmall();

    function _renderSmall() {
        return skeleton
            ? (
                <div className={styles['game-card']}>
                    <div className="img-container">
                    <Skeleton className={styles['game-card-img']} variant="rectangular" width={240} height={height} animation="wave"
                              sx={{bgcolor: 'grey.700'}}/>

                    </div>
                </div>)
            : (
                <div className={styles['game-card']}>
                    <div className="img-container">
                        <img src={cover} alt="" style={{width, height}} className={styles['game-card-img']}
                         onClick={() => router.push({pathname: '/details', query: {gid: idGame}})}/>
                    </div>
                </div>
            );
    }

    function _renderBig() {
        return skeleton
            ? (
                <div className={styles['game-card']}>
                    <div className="img-container">
                        <Skeleton variant="rectangular" width={240} height={height} animation="wave"
                                  sx={{bgcolor: 'grey.700'}}/>
                    </div>
                </div>
            )
            : (
                <div className={styles['game-card']}>
                    <div className="img-container">
                        <img src={cover} alt="" style={{width, height}} className={styles['game-card-img']}
                             onClick={() => router.push({pathname: '/details', query: {gid: idGame}})}/>
                    </div>
                    <div style={{width}} className={styles['game-card-title']}>{title}</div>
                    <div style={{color: scoreColor}} className={`${styles['game-card-score']}`}>
                        {formatter.format(Math.ceil(score) / 100)}
                    </div>
                </div>
            )
    }


};

export default GameCard;