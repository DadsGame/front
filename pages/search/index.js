import { useRouter } from 'next/router';
import useDebounce from '../../hooks/useDebounce.js';
import { useEffect, useState } from 'react';
import SearchCard from '../../components/SearchCard.js';
import styles from '../../styles/Search.module.css';
import { Box } from '@mui/material';

const Search = ({ cookies }) => {
  const router = useRouter();
  const search = useDebounce(router.query.search, 500);
  const [games, setGames] = useState([]);

  useEffect(() => setGames(Array(10).fill(<SearchCard />)), []);

  useEffect(() => {
    const searchGame = async () => {
      setGames(Array(10).fill(<SearchCard />));
      const searchUrl = new URL(
        '/api/igdb/games/search',
        process.env.NEXT_PUBLIC_BTB_API_URL
      );
      searchUrl.searchParams.set('name', search);
      const res = await fetch(searchUrl.toString());
      const allGames = await res.json();
      const searchCardGames = allGames.map((game) => {
        if (game.name == null || game.summary == null || game.cover == null)
          return;

        return (
          <SearchCard
            game={{
              id: game.id,
              name: game.name,
              description: game.summary,
              image: game.cover,
            }}
          />
        );
      });

      setGames(searchCardGames);
    };
    searchGame();
  }, [search]);

  useEffect(() => {}, [games]);

  return (
    <div>
      <div className={styles['search-title-container']}>
        <span className={styles['search-title']}>Search: </span> {search}
      </div>
      <div className={styles.games}>
        {games.length === 0 ? <div>no games found</div> : games}
      </div>
    </div>
  );
};

export default Search;
