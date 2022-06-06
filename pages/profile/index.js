import {withCookies} from "react-cookie";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import GenericCard from "../../components/GenericCard.js";
import {Link} from "@mui/material";
import styles from '../../styles/Profile.module.css';


const Profile = ({cookies}) => {

    const token = cookies.get('user');
    const router = useRouter();
    const [profile, setProfile] = useState({});
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const redirectIfNeeded = async () => {
            if (token == null || token === '') {
                return await router.push('/login?alert=You must be logged in to see your profile.');
            }
        };
        redirectIfNeeded();
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const url = new URL(`/users/profile`, process.env.NEXT_PUBLIC_MAIN_API_URL);

            const res = await fetch(url.toString(), {
                    headers: {'Authorization': `Bearer ${token}`}
                });
            const profileJson = await res.json();

            const postsUrl = new URL(`/posts/byAuthor/${profileJson.username}`, process.env.NEXT_PUBLIC_MAIN_API_URL)
            const resPosts = await fetch(postsUrl.toString());
            const postsJson = await resPosts.json();


            setProfile(profileJson);
            setPosts(postsJson);
        };
        fetchProfile();
    }, []);


    return (token == null || token === '') ? ''
        : (
            <>
                <GenericCard>
                    <div>
                        <h1>Your profile</h1>
                        <ul>
                            <li>email: {profile.email}</li>
                            <li>username: {profile.username}</li>
                        </ul>
                    </div>
                </GenericCard>
                <GenericCard>
                    <div>
                        <h1>Forum Activity</h1>
                        <h2>Your posts</h2>
                        <ul>
                            {posts == null ||posts.length === 0
                                ? (<li>You haven&apos;t made any posts yet.</li>)
                                :  (posts.map((post) => (<li>Post: {post.title} -  <Link href={`/posts/see?id=${post.id}`} aria-label={`Read the post - ${post.title}`}>Read the post</Link></li>)))
                            }
                        </ul>
                    </div>
                </GenericCard>
            </>
        );
};

export default withCookies(Profile);