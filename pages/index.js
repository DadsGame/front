import TopCardsList from "../components/TopCardsList.js";
import {withCookies} from "react-cookie";


function Home({games, games2, cookies}) {
    const titleCat1 = 'Top 10 recent games (last 3 months)';
    const titleCat2 = 'Best Rating game on the platform';

    return (
        <div>
            <div>
                <TopCardsList games={games} titleCat={titleCat1}/>
                <TopCardsList games={games2} titleCat={titleCat2}/>
            </div>
        </div>
    )
}

export async function getStaticProps() {
    const res = await fetch(new URL('api/igdb/topten', process.env.NEXT_PUBLIC_BTB_API_URL))
    const games = await res.json()
    await games.forEach((game) => {
        game.isIgdb = true;
    })


    const res2 = await fetch(new URL('/games/bestRating', process.env.NEXT_PUBLIC_MAIN_API_URL))
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
    return {
        props: {
            games,
            games2,
        },
    }
}

export default withCookies(Home);

