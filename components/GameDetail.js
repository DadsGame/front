import {React, useEffect, useState} from "react";

import styles from '../styles/Details.module.css';
import GenericCard from "./GenericCard.js";
import {Alert, Button, Link, Snackbar} from "@mui/material";
import {useRouter} from "next/router";
import useBreakpoint from "../hooks/useBreakpoint";
import {withCookies} from "react-cookie";
import UserReview from "./UserReview";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

const GameDetail = ({game, latestsPosts, cookies}) => {
    const [isWished, setWished] = useState(checkIfWished)
    const router = useRouter();
    const {breakPointName} = useBreakpoint()
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [sucess, setSuccess] = useState('')
    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    async function checkIfGameAlreadyExists(igdbId, token) {
        const gameUrl = new URL(`games/byIgdb`, process.env.NEXT_PUBLIC_MAIN_API_URL);
        gameUrl.searchParams.set('id', igdbId);
        const res = await fetch(gameUrl.toString(), {
            headers: {'Authorization': `Bearer ${token}`}
        });
        const json = await res.json();
        return {alreadyExists: Object.values(json).length !== 0, id: json.id};
    }

    async function checkIfWished() {
        const myToken = cookies.get('user') ?? '';
        if (!!myToken) {
            const alreadyExists = (await checkIfGameAlreadyExists(game.id, myToken));
            const alreadyExistBool = alreadyExists.alreadyExists;
            if (alreadyExistBool){
                console.log('connecte', myToken, game)
                const url = new URL(`games/${game.id}/isWished`, process.env.NEXT_PUBLIC_MAIN_API_URL)
                const r = await fetch(url.toString() , {
                    headers: {'Authorization': `Bearer ${myToken}`},
                    method: 'GET',
                })
                const wished = await r.json();
                console.log('wished: ',wished)
                setWished(wished)
            } else {
                console.log('game does not exist')
                setWished(false)
            }
        } else {
            console.log('non connecte', myToken)
        }
    }
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'percent',
        maximumFractionDigits: 0
    });

    const token = cookies.get('user') ?? '';

    async function addToWishList(id) {
        const addGameToApi = async (data, token) => {
            const postGameUrl = new URL('/games', process.env.NEXT_PUBLIC_MAIN_API_URL);
            const res = await fetch(postGameUrl.toString(), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                method: 'POST',
                body: JSON.stringify(data),
            });
            return await res.json();
        };

        const alreadyExists = (await checkIfGameAlreadyExists(id, token));
        const alreadyExistBool = alreadyExists.alreadyExists;
        console.log(token)
        if (!alreadyExistBool) {
            await addGameToApi({name: game.name, igdbId: game.id}, token)
        }
            const wishUrl = new URL(`/games/addToWishlist/${game.id}`, process.env.NEXT_PUBLIC_MAIN_API_URL);
            const res = await fetch(wishUrl.toString(), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                method: 'POST',
                body: JSON.stringify()
            }).then((res) => {
                setOpen(true)
                if (res.ok) {
                    setWished(true)
                    setSuccess("Game successfully added to wishlist")
                } else {
                    setError('Error while adding game to wishlist')
                }
            })

    }

    async function removeFromWishList(id) {
        const wishUrl = new URL(`/games/userWishlist/${game.id}`, process.env.NEXT_PUBLIC_MAIN_API_URL);
        const res = await fetch(wishUrl.toString(), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            method: 'DELETE',
            body: JSON.stringify()
        }).then((res) => {
            setOpen(true)
            if (res.ok) {
                setWished(false)
                setSuccess("Game successfully removed from wishlist")
            } else {
                setError('Error while removing game from wishlist')
            }
        })
    }

    return (
        <div className={styles.cards}>
            <GenericCard style={{gridColumn: '1/3'}}>
                <div>
                    <div className={styles[`details-container-${breakPointName}`]}>
                        <div className={styles[`details-image-container`]}>
                            <img className={styles['game-detail-img']} src={game.cover}/>
                        </div>
                        <div className={styles['game-detail-title']}>
                            {JSON.stringify(game.name).replaceAll('"', '')}
                        </div>
                        <div className={styles['game-detail-score']}>
                            {game.aggregated_rating != null
                                ? <span>score: {formatter.format(game.aggregated_rating / 100)}</span>
                                : <span> No rating found.</span>
                            }
                        </div>
                        <div className={styles['game-detail-genre']}>
                            genres:
                            <ul>
                                {game.genres.map((genre) => (<li>{genre.name}</li>))}
                            </ul>
                        </div>
                        <div className={styles['game-detail-add-lib']}>
                            <Button variant="contained"
                                    onClick={() => router.push(`/add_game?game_name=${game.name.replace('&', '%26')}&fromSearch=true&gameId=${game.id}`)}>Add
                                to Library</Button>
                            {
                                !!token
                                ?
                                    !isWished
                                        ?<Button variant="contained"
                                                 onClick={() => addToWishList(game.id)}>
                                            <BookmarkAddIcon></BookmarkAddIcon>
                                        </Button>
                                        : <Button variant="contained"
                                                  onClick={() => removeFromWishList(game.id)}>
                                            <BookmarkAddedIcon></BookmarkAddedIcon>
                                        </Button>

                            : <div></div>
                            }

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
            <GenericCard>
                <div className={styles['forum-header']}>
                    <div className={styles['forum-header-title']}>
                        Forum
                    </div>
                    <div className={styles['forum-header-btns']}>
                        <Button variant="contained" onClick={() => router.push(`/posts/add?gid=${game.id}`)}>Add a
                            post</Button>
                        {latestsPosts != null && latestsPosts.length > 0
                            ? <Button variant="contained" onClick={() => router.push(`/posts?gid=${game.id}`)}>See all
                                posts</Button>
                            : ''
                        }
                    </div>
                </div>
                <div>
                    <div className={styles['forum-latest-post-title']}>Latests Posts</div>
                    <div className="posts">
                        {latestsPosts == null || latestsPosts.length === 0
                            ? <span>No posts found for this game yet.</span>
                            : ''}
                        {latestsPosts != null && latestsPosts.length > 0
                            ? latestsPosts.map((post) => (
                                <ul>
                                    <li>
                                        Author: {post.author}, title: {post.title}. <Link
                                        href={`/posts/see?id=${post.id}`} aria-label={`Read More - ${post.title}`}>Read
                                        More</Link>
                                    </li>
                                </ul>))
                            : ''}
                    </div>
                </div>
            </GenericCard>
            <GenericCard>
                <UserReview igdbId={game.id}/>
            </GenericCard>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                { error !== '' ?
                    <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                        {error}
                    </Alert>
                    :  <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
                        {sucess}
                    </Alert>
                }
            </Snackbar>
        </div>
    )

};

export default withCookies(GameDetail);