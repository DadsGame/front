import {withCookies} from "react-cookie";
import ForumPost from "../../../components/ForumPost.js";
import {useRouter} from "next/router";
import {Button, Link} from "@mui/material";
import {useEffect, useState} from "react";


const SeePost = ({cookies, post}) => {
    const token =  cookies.get('user') ?? '';
    const router = useRouter();
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const addComment = async () => {
            if(formData == null || Object.values(formData).length === 0) return;
            const addCommentUrl = new URL('/comments/currentUser', process.env.NEXT_PUBLIC_MAIN_API_URL);
            const res = await fetch(addCommentUrl.toString(), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                method: 'POST',
                body: JSON.stringify({
                    content: formData.content,
                    postComment: router.query.id,
                })});
            router.replace(router.asPath);
        };
        addComment();
    }, [formData]);

    if(router.query?.id == null || post == null) {
        return(
            <>
                <div>Post not found</div>
                <Link href="/">Return to homepage?</Link>
            </>
        );
    }

    return(
        <ForumPost isLoggedIn={token != null} post={post} setFormData={setFormData}/>
    )
};


export default withCookies(SeePost);

export async function getServerSideProps(context) {
    const id = context.query?.id ?? '';
    const url = new URL (`/posts/${id}`, process.env.NEXT_PUBLIC_MAIN_API_URL);
    const res = await fetch(url.toString());
    const post = await res.json();

    return {
        props: {
            post,
        },
    }
}