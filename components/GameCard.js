import {React, useState} from "react";

import styles from '../styles/GameCard.module.css';
import {Backdrop, Box, Modal, Typography} from "@mui/material";
import useBreakpoint from "../hooks/useBreakpoint.js";
import {useRouter} from "next/router";

const GameCard = ({cover, score, title, scoreColor = '#fff', id}) => {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const {breakPointName, width, height} = useBreakpoint();
    const router = useRouter();
    const idGame = id;

    // TODO: Put the formatter in i18n lib when dealing with translation
    const formatter = new Intl.NumberFormat('fr-FR', {style: 'percent',
        maximumFractionDigits: 0});

    return breakPointName === 'large' ? _renderBig() : _renderSmall();

    function _renderSmall() {
        return (
            <div className={styles['game-card']}>
            <img src={cover} alt="" style={{width, height}} className={styles['game-card-img']} onClick={() => router.push({pathname: '/details', query: {gid: idGame}})} />
            {/*<div className="modal">
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        transform: 'translateY(-100%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        color: 'black',
                        animation: `${styles.bottomToVisible} 0.3s`,
                    }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {title}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            {score}
                        </Typography>
                    </Box>
                </Modal>
            </div>
            */}
        </div>
        );
    }

    function _renderBig() {
        return(
            <div className={styles['game-card']}>
                <img src={cover} alt="" style={{width, height}} className={styles['game-card-img']} onClick={() => router.push({pathname: '/details', query: {gid: idGame}})} />
                <div style={{width}} className={styles['game-card-title']}>{title}</div>
                <div style={{color: scoreColor}} className={`${styles['game-card-score']}`}>
                    {formatter.format(Math.ceil(score) / 100)}
                </div>
                {/*
                <div className="modal">
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                            color: 'black',
                            animation: breakPointName === 'sml' ? `${styles.bottomToVisible} 0.3s` : '',
                        }}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Card Modal
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            </Typography>
                        </Box>
                    </Modal>
                </div>
                */}
            </div>
        )
    }


};

export default GameCard;