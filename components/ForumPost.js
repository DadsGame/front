import {React, useState} from "react";

import styles from '../styles/ForumPost.module.css';
import {Backdrop, Box, Modal, Skeleton, Typography} from "@mui/material";
import useBreakpoint from "../hooks/useBreakpoint.js";
import {useRouter} from "next/router";
import ForumForm from "./ForumForm.js";

const ForumPost = ({isLoggedIn, post, setFormData}) => {

    return (
        <div>
            <div className={styles.post}>
                <div className={styles['post-title']}>{post.title}</div>
                <div className={styles['post-author']}>{post.author}</div>
                <div className={styles['post-content']}>{post.content}</div>
            </div>
            <div className={styles.comments}>
                {post.comments == null || post.comments.length === 0
                    ?  <div className={styles.comment}>
                        <div className={styles['comment-content']}>There&apos;s no comment yet.</div>
                    </div>
                    : ''
                }
                {post.comments?.map((comment) => {
                    return (
                        <div className={styles.comment}>
                            <div className={styles['comment-author']}>{comment.author}</div>
                            <div className={styles['comment-content']}>{comment.content}</div>
                        </div>
                    );
                })}
            </div>
            <div className="answer">
                {!isLoggedIn
                    ? <div className={styles.comment}>
                        <div className={styles['comment-content']}>You need to be logged in in order to comment.</div>
                    </div>
                    : <ForumForm isPost={false} setFormData={setFormData}/>
                }
            </div>

        </div>

    )


};

export default ForumPost;