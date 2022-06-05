import React, {useEffect, useState} from "react";
import {withCookies} from "react-cookie";
import Rating from "@mui/material/Rating";
import styles from "../styles/CommentForm.module.css";

const UserReview = ({gameId, cookies}) => {
    const token = cookies.get('user') ?? '';
    const [reviews, setReviews] = useState([])

    useEffect( () => {
        async function fetchReviews() {
            console.log(token)
            const url = new URL(`/games/review?idGame=${gameId}`, process.env.NEXT_PUBLIC_MAIN_API_URL)
            const res = await fetch(url, {
                method: 'GET',
                headers: {'Authorization': `Bearer ${token}`}
            })
            let response = await res.json()
            console.log('response',response)
            setReviews(response)
        }
        fetchReviews()
        }, []);

    return (
        <div>
            <div className={styles["reviews-title"]}>Reviews</div>
            { reviews.length > 0 ?
            reviews.map((r) => (
                <div className={styles['review']}>
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