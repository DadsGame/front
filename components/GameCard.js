import { React, useState } from 'react';

import styles from '../styles/GameCard.module.css';
import useBreakpoint from '../hooks/useBreakpoint.js';
import { useRouter } from 'next/router';
import CoverNotFound from '../public/images/cover_not_found_2.png';
import { Alert, Snackbar } from '@mui/material';
import Image from 'next';

const GameCard = ({
  cover,
  score,
  title,
  scoreColor = '#fff',
  id,
  isIgdb,
  igdb_id,
}) => {
  const { breakPointName, width, height } = useBreakpoint();
  const router = useRouter();
  const idGame = id;
  const skeleton = cover == null || score == null || id == null;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  // TODO: Put the formatter in i18n lib when dealing with translation
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 0,
  });

  function goToDetails() {
    if (isIgdb) {
      if (igdb_id != null) {
        return router.push({ pathname: '/details', query: { gid: igdb_id } });
      } else {
        return router.push({ pathname: '/details', query: { gid: idGame } });
      }
    }
    setOpen(true);
    setError('No Detail page');
  }

  return breakPointName === 'large' ? _renderBig() : _renderSmall();

  function _renderSmall() {
    return (
      <div>
        <div className={styles['game-card']}>
          <div className="img-container">
            {isIgdb ? (
              <img
                src={cover}
                alt=""
                style={{ width, height }}
                className={styles['game-card-img']}
                onClick={() => goToDetails()}
              />
            ) : (
              <img
                src={CoverNotFound.src}
                alt=""
                width={width}
                height={height}
                className={styles['game-card-img']}
                onClick={() => goToDetails()}
              />
            )}
          </div>
        </div>
        <div
          style={{ width }}
          className={styles[`game-card-title${!isIgdb ? '-local' : ''}`]}
        >
          {title}
        </div>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          {error !== '' ? (
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: '100%' }}
            >
              {error}
            </Alert>
          ) : (
            <div></div>
          )}
        </Snackbar>
      </div>
    );
  }

  function _renderBig() {
    return (
      <div>
        <div className={styles['game-card']}>
          <div className="img-container">
            {isIgdb ? (
              <div>
                <img
                  src={cover}
                  alt=""
                  style={{ width, height }}
                  className={styles['game-card-img']}
                  onClick={() => goToDetails()}
                />
                {!!score ? (
                  <div
                    style={{ color: scoreColor }}
                    className={`${styles['game-card-score']}`}
                  >
                    {formatter.format(Math.ceil(score) / 100)}
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            ) : (
              <img
                src={CoverNotFound.src}
                alt=""
                width={width}
                height={height}
                className={styles['game-card-img']}
                onClick={() => goToDetails()}
              />
            )}
          </div>
          <div
            style={{ width }}
            className={styles[`game-card-title${!isIgdb ? '-local' : ''}`]}
          >
            {title}
          </div>
        </div>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          {error !== '' ? (
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: '100%' }}
            >
              {error}
            </Alert>
          ) : (
            <div></div>
          )}
        </Snackbar>
      </div>
    );
  }
};

export default GameCard;
