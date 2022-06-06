import {React} from 'react';
import {useRouter} from "next/router";
import GameDetail from "../components/GameDetail";
import {Link} from "@mui/material";

export default function Details({games, posts}) {
    const router = useRouter();
    const game = games[0] ?? {};

    if(router.query?.gid == null || Object.values(game).length === 0) {
        return(
            <>
                <div>Oo sorry the game doesn&apos;t exist or hasn&apos;t been found.</div>
                <Link href="/">Return to homepage?</Link>
            </>
        );
    }

    return (
            <div>
                <GameDetail game={game} latestsPosts={posts} />
            </div>
    )
}

export async function getServerSideProps(context) {
    let games
        const url = new URL ('/api/igdb/games/byId', process.env.NEXT_PUBLIC_BTB_API_URL)
        url.searchParams.set('id', context.query.gid)
        const res = await fetch(url.toString())
        games = await res.json()

    const postsUrl =  new URL (`/posts/byGameTopic/filtered/${context.query.gid}`, process.env.NEXT_PUBLIC_MAIN_API_URL);
    const resPosts = await fetch(postsUrl.toString())
    const posts = await resPosts.json()
    return {
        props: {
            games,
            posts
        },
    }
}
