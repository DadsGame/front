import {React, useState} from "react";

import styles from '../styles/GameCard.module.css';
import {Box, Modal, Typography} from "@mui/material";

const GameCard = ({cover, score, title, scoreColor = '#fff'}) => {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // TODO: Put the formatter in i18n lib when dealing with translation
    const formatter = new Intl.NumberFormat('fr-FR', {style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2});

    return(
        <div className={styles['game-card']}>
            <img src={cover} alt="" className={styles['game-card-img']} onClick={handleOpen} />
                <div className={styles['game-card-title']}>{title}</div>
                <div style={{color: scoreColor}} className={`${styles['game-card-score']}`}>{formatter.format(Math.floor(score) / 100)}</div>
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
                    }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Card Modal
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Lorem Ipsum...
                        </Typography>
                    </Box>
                </Modal>
            </div>
        </div>

    );
};

export default GameCard;