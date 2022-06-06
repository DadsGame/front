import {withCookies} from "react-cookie";
import * as React from "react";
import {useState} from "react";
import styles from "../styles/Details.module.css";
import {Alert, MenuItem, Select, Snackbar} from "@mui/material";

const ModifyGameLibrary = ({childToParent, cookies, game, gameContent, breakPointName}) => {
    const token = cookies.get('user') ?? '';
    const [status, setStatus] = useState(game.status);
    const [hours, setPlaytime] = useState(game.playtime);
    const [boughAt, setPrice] = useState(game.bought_at);
    const [soldAt, SetSoldAt] = useState(game.sold_at);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);

    function hasChanged() {
        let changed = game.status != status || hours != game.playtime || boughAt != game.bought_at || soldAt != game.sold_at;
        return !changed;
    }

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    let handleSubmit = async (e) => {
        e.preventDefault()

            const updateGameLibUrl = new URL('/games/toLibrary', process.env.NEXT_PUBLIC_MAIN_API_URL);
            let res = await fetch(updateGameLibUrl , {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idGame: game.id_game,
                    boughtAt: boughAt,
                    playtime: hours,
                    soldAt: soldAt,
                    status: status,
                }),
            });

            setOpen(true);

            if(!res.ok) {
                console.log('not ok',res)
                setError('Edit failed');
                return;
            }

            setError('');
            setTimeout(() => {
                childToParent(false, {playtime: hours, bought_at: boughAt, sold_at: soldAt, status, id_game: game.id_game, id_user:game.id_user, idgb_id: game.igdb_id, name: game.name})
            }, 1000);

    }

    function handleChangeStatus(event) {
        setStatus(event.target.value);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
            <div className={styles[`details-container-${breakPointName}`]}>
                <div className={styles[`details-image-container`]}>
                    <img className={styles['game-detail-img']}
                         src={gameContent[0].cover}/>
                </div>
                <div className={styles['game-detail-title']}>
                    {JSON.stringify(gameContent[0].name).replaceAll('"', '')}
                </div>
                <div className={styles['game-detail-subtitle']}>
                    <div>
                        <span>Playtime: </span>
                        <input type="number" placeholder={game.playtime} onChange={(e) => setPlaytime(e.target.value)}/>h
                    </div>
                    <div>
                        Bought at: <input className={styles.input} type="number" placeholder={game.bought_at} onChange={(e) => setPrice(e.target.value)}/> €
                    </div>
                    <div>
                        Sold at: <input type="number" placeholder={game.sold_at} onChange={(e) => SetSoldAt(e.target.value)}/> €
                    </div>
                    <Select
                        className={styles.select}
                        labelId="game-status-label"
                        id="demo-simple-select"
                        value={status}
                        label="Game Status"
                        onChange={handleChangeStatus}
                    >
                        <MenuItem value="not started">not started</MenuItem>
                        <MenuItem value="started">started</MenuItem>
                        <MenuItem value="finished">finished</MenuItem>
                        <MenuItem value="won't continue">won&apos;t continue</MenuItem>
                    </Select>
                    <br />
                    <div className={styles.editButtonsContainer}>
                <button className={styles.editButtons} type="submit" disabled={hasChanged()}>Save</button>
                <button className={styles.editButtons} onClick={() => childToParent(false, game)}>Cancel</button>
                    </div>
                </div>
            </div>
            </form>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                {(error !== '')
                    ? <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                        {error}
                    </Alert>
                    : <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
                        Saved !
                    </Alert>
                }
            </Snackbar>
        </div>
    )
}

export default withCookies(ModifyGameLibrary);