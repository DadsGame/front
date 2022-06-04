import {withCookies} from "react-cookie";
import {React, useState} from "react";
import Rating from "@mui/material/Rating";
import styles from "../styles/CommentForm.module.css";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import {useRouter} from "next/router";

const AddGameForm = ({gameId, setFormData,userId, cookies}) => {
    const router = useRouter();
    const token = cookies.get('user');
    const [comment, setComment] = useState("");
    const [value, setValue] = useState(0);
    const [error, setError] = useState('');

    let handleSubmit = async (e) => {
        e.preventDefault()
        try {
            console.log('send data ', {comment}, {value})
            const commentUrl = new URL('/games/addReview', process.env.NEXT_PUBLIC_MAIN_API_URL);
            let res = await fetch(commentUrl , {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idUser: userId,
                    idGame: gameId,
                    rate: value,
                    review: comment,
                }),
            }).then((res) => {
                if (!res.ok ) return;
                return res.json();
            })
                .then((res) => {
                    if (res == null || Object.values(res).length === 0) {
                        console.log('error ')
                        setError("invalid review");
                    } else {
                        setError('');
                    }
            })
        } catch (err) {
            console.log(err)
        }
        await router.push('/')
    }

    return (

            <form onSubmit={handleSubmit}>
                <div>
                <Rating className={styles['comment-form-rate']}
                    name="simple-controlled"
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                />
                </div>
                <TextareaAutosize className={styles['comment-form-input']}
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="comment"
                    style={{ width: 500 }}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button type="submit" color="primary" className={styles['comment-form-button']}>Send review</button>
            </form>

    )

}


export default withCookies(AddGameForm);