import {withCookies} from "react-cookie";
import {useEffect, useState} from "react";
import ForumForm from "../../../components/ForumForm.js";
import {Alert, Snackbar} from "@mui/material";
import {useRouter} from "next/router";


const checkIfGameTopicExists = async (gameTopicId) => {
    const gameTopicUrl = new URL(`/gametopics/${gameTopicId}`, process.env.NEXT_PUBLIC_MAIN_API_URL);
    const res = await fetch(gameTopicUrl.toString());
    const json = await res.json();
    console.log(json);
    return json != null;
};

const addGameTopic = async (gameTopicId, token) => {
    const gameTopicUrl = new URL(`/gametopics`, process.env.NEXT_PUBLIC_MAIN_API_URL);
    const res = await fetch(gameTopicUrl.toString(), {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
           id: gameTopicId
        }),
    });
    const json = await res.json();
    return json;
};


const AddPost = ({cookies}) => {

    const router = useRouter();
    const token = cookies.get('user') ?? '';
    const [formData, setFormData] = useState({});
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    useEffect(() => {
        const redirectIfNeeded = async () => {
            if (token == null || token === '') {
                return await router.push('/login?alert=You must be logged in to add a post.');
            } else if (router.query?.gid == null && !router.asPath?.split('?')?.[1]?.startsWith('gid=') ) {
                setOpen(true);
            }
        };
        redirectIfNeeded();
    });

    useEffect(() => {
        const addPost = async () => {
            if(Object.values(formData).length === 0) return;
            const gameTopicExists = await checkIfGameTopicExists(router.query.gid);
            console.log('gexist', gameTopicExists);
            if(!gameTopicExists) {
                await addGameTopic(router.query.gid, token);
            }
            const addPostUrl = new URL('/posts/currentUser', process.env.NEXT_PUBLIC_MAIN_API_URL);
            const res = await fetch(addPostUrl.toString(), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                method: 'POST',
                body: JSON.stringify({
                    title: formData.title,
                    content: formData.content,
                    gameTopic: router.query.gid,
                })});
            const json = await res.json();
            return await router.push(`/posts/see?id=${json.id}`);
        }
        addPost();
    }, [formData]);


    if(token == null) {
        return '';
    }

    return (
        <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                            No game associated to the post you want to create
                        </Alert>
            </Snackbar>
            <ForumForm setFormData={setFormData} isPost={true} />
    </div>);


};
export default withCookies(AddPost);