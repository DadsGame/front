import {React} from "react";

import styles from '../styles/Details.module.css';
import GenericCard from "./GenericCard.js";
import {Button, Link} from "@mui/material";
import {useRouter} from "next/router";
import useBreakpoint from "../hooks/useBreakpoint";

const GameDetail = ({game, latestsPosts}) => {
    const router = useRouter();
    const {breakPointName} = useBreakpoint()
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'percent',
        maximumFractionDigits: 0
    });

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
                           <Button variant="contained" onClick={() => router.push(`/add_game?game_name=${game.name.replace('&', '%26')}&fromSearch=true&gameId=${game.id}`)}>Add to Library</Button>
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
                        <Button variant="contained" onClick={() => router.push(`/posts/add?gid=${game.id}`)}>Add a post</Button>
                        {latestsPosts != null && latestsPosts.length > 0
                            ?  <Button variant="contained" onClick={() => router.push(`/posts?gid=${game.id}`)}>See all posts</Button>
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
                                    Author: {post.author}, title: {post.title}. <Link href={`/posts/see?id=${post.id}`} aria-label={`Read More - ${post.title}`}>Read More</Link>
                                </li>
                            </ul>))
                        : ''}
                    </div>
                </div>
            </GenericCard>
            <GenericCard>
            Foobar
        </GenericCard>
        </div>
    )

};

export default GameDetail;