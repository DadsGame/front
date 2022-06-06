import TopCardsList from "../components/TopCardsList.js";
import {withCookies} from "react-cookie";
import styles from "../styles/TopCardsList.module.css";
import {React} from "react";


function Home({games, games2, games3, games4, cookies}) {
    const titleCat1 = 'Top 10 recent games (last 3 months)';
    const titleCat2 = 'Best Rating game on the platform';
    const titleCat3 = 'Most Finished game on the platform';
    const titleCat4 = 'Games with the highest playtime';

    return (
        <div>
            <div>
                <div className={styles['title-category']}> {titleCat1} </div>
                <TopCardsList games={games} />
                <div className={styles['title-category']}> {titleCat2} </div>
                {
                    (games2 == null || games2.length === 0)
                        ? <span className={styles['not-enough-data']}>Not enough data to show this category.</span>
                        :  <TopCardsList games={games2} />
                }
                <div className={styles['title-category']}> {titleCat3} </div>
                {
                    (games3 == null || games3.length === 0)
                        ? <span className={styles['not-enough-data']}>Not enough data to show this category.</span>
                        :  <TopCardsList games={games3} />
                }

                <div className={styles['title-category']}> {titleCat4} </div>
                {
                    (games4 == null || games4.length === 0)
                        ? <span className={styles['not-enough-data']}>Not enough data to show this category.</span>
                        :  <TopCardsList games={games4} />
                }
            </div>
        </div>
    )
}

export async function getServerSideProps() {
    const res = await fetch(new URL('api/igdb/topten', process.env.NEXT_PUBLIC_BTB_API_URL))
    const games = await res.json()
    await games.forEach((game) => {
        game.isIgdb = true;
    })

    const res2 = await fetch(new URL('/games/bestRating', process.env.NEXT_PUBLIC_MAIN_API_URL).toString())
    let games2 = await res2.json()
    games2 = await Promise.all(games2.map(async (g) => {
        if (g.igdb_id != null) {
            const url = new URL('/api/igdb/games/byId', process.env.NEXT_PUBLIC_BTB_API_URL)
            url.searchParams.set('id', g.igdb_id)

            const r = await fetch(url.toString())
            const rcover = await r.json()
            return {...g, cover:rcover[0].cover}
        } else {
            return g
        }
    }));
    const res3 = await fetch(new URL('/games/mostFinished', process.env.NEXT_PUBLIC_MAIN_API_URL).toString())
    let games3 = await res3.json()
    games3 = await Promise.all(games3.map(async (g) => {
        if (g.igdb_id != null) {
            const url = new URL('/api/igdb/games/byId', process.env.NEXT_PUBLIC_BTB_API_URL)
            url.searchParams.set('id', g.igdb_id)

            const r = await fetch(url.toString())
            const rcover = await r.json()
            return {...g, cover:rcover[0].cover}
        } else {
            return g
        }
    }));

    const res4 = await fetch(new URL('/games/averagePlaytime', process.env.NEXT_PUBLIC_MAIN_API_URL).toString())
    let games4 = await res4.json()
    games4 = await Promise.all(games4.map(async (g) => {
        if (g.igdb_id != null) {
            const url = new URL('/api/igdb/games/byId', process.env.NEXT_PUBLIC_BTB_API_URL)
            url.searchParams.set('id', g.igdb_id)

            const r = await fetch(url.toString())
            const rcover = await r.json()
            return {...g, cover:rcover[0].cover}
        } else {
            return g
        }
    }));

    return {
        props: {
            games,
            games2,
            games3,
            games4,
        },
    }
}

export default withCookies(Home);

