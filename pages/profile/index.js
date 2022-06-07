import { withCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import GenericCard from '../../components/GenericCard.js';
import { Link } from '@mui/material';
import styles from '../../styles/Profile.module.css';

const Profile = ({ cookies }) => {
  const token = cookies.get('user');
  const router = useRouter();
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const redirectIfNeeded = async () => {
      if (token == null || token === '') {
        return await router.push(
          '/login?alert=You must be logged in to see your profile.'
        );
      }
    };
    redirectIfNeeded();
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const url = new URL(
        `/users/profile`,
        process.env.NEXT_PUBLIC_MAIN_API_URL
      );
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileJson = await res.json();
      'p', profileJson;

      const postsUrl = new URL(
        `/posts/byAuthor/${profileJson.username}`,
        process.env.NEXT_PUBLIC_MAIN_API_URL
      );
      const resPosts = await fetch(postsUrl.toString());
      const postsJson = await resPosts.json();

      const wishListUrl = new URL(
        `/games/wishlist`,
        process.env.NEXT_PUBLIC_MAIN_API_URL
      );
      const resWishList = await fetch(wishListUrl.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const wishListJson = await resWishList.json();

      setProfile(profileJson);
      setPosts(postsJson);
      setWishlist(wishListJson);
    };
    fetchProfile();
  }, []);

  return token == null || token === '' ? (
    ''
  ) : (
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
            {posts == null || posts.length === 0 ? (
              <li>You haven&apos;t made any posts yet.</li>
            ) : (
              posts.map((post) => (
                <li>
                  Post: {post.title} -{' '}
                  <Link
                    href={`/posts/see?id=${post.id}`}
                    aria-label={`Read the post - ${post.title}`}
                  >
                    Read the post
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </GenericCard>
      <GenericCard>
        <div>
          <h1>Wishlist</h1>
          <ul>
            {wishlist == null || wishlist.length === 0 ? (
              <li>You don&apos;t have any game on your wishlist yet.</li>
            ) : (
              wishlist.map((game) => (
                <li>
                  Game: {game.name} -{' '}
                  <Link
                    href={`/details?gid=${game.igdb_id}`}
                    aria-label={`More details - ${game.name}`}
                  >
                    More details
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </GenericCard>
    </>
  );
};

export default withCookies(Profile);
