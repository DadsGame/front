import React, {useEffect, useState} from "react";
import {withCookies} from "react-cookie";
import Rating from "@mui/material/Rating";
import styles from "../styles/CommentForm.module.css";

const UserReview = ({gameId, igdbId, cookies}) => {
    const token = cookies.get('user') ?? '';
    const [reviews, setReviews] = useState([])

    useEffect( () => {
        async function fetchReviews() {
            const url = new URL(`/games/reviewIgdb?idGame=${igdbId}`, process.env.NEXT_PUBLIC_MAIN_API_URL)
            const res = await fetch(url.toString(), {
                method: 'GET',
            })
            let response = await res.json()
            setReviews(response)
        }
        fetchReviews()
        }, []);

    return (
        <div>
            <div className={styles["reviews-title"]}>Reviews</div>
            { reviews.length > 0 ?
            reviews.map((r, index) => (
                <div key={index} className={styles['review']}>
                    <div className={styles['review-username']}>{r.username}</div>
                    <div><Rating name="read-only" value={r.rate} readOnly /></div>
                    <div>{r.review}</div>
                </div>
            ))
                : <div>No review available</div>}
        </div>
    )

}

export default withCookies(UserReview);