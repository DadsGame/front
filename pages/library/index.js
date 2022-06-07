import { withCookies } from 'react-cookie';
import React, { useEffect, useState } from 'react';
import ClippedDrawer from '../../components/ClippedDrawer';
import { useRouter } from 'next/router';

function Library({ cookies }) {
  const router = useRouter();
  const [library, updateLibrary] = useState([]);
  const token = cookies.get('user') ?? '';
  async function fetchLibrary() {
    const url = new URL(
      '/games/userLibrary',
      process.env.NEXT_PUBLIC_MAIN_API_URL
    );
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    let response = await res.json();
    response = await Promise.all(
      response.map(async (response) => {
        if (response.igdb_id == null) return response;
        const postsUrl = new URL(
          `/posts/byGameTopic/filtered/${response.igdb_id}`,
          process.env.NEXT_PUBLIC_MAIN_API_URL
        );
        const resPosts = await fetch(postsUrl.toString());
        const posts = await resPosts.json();
        return { ...response, latestsPosts: posts };
      })
    );
    updateLibrary(response);
  }
  useEffect(() => {
    fetchLibrary();
  }, []);
  useEffect(() => {
    fetchLibrary();
  }, [router.asPath]);

  return (
    <div>
      <ClippedDrawer library={library} token={token} />
    </div>
  );
}

export default withCookies(Library);
