import {React} from 'react';
import {useRouter} from "next/router";
import GameDetail from "../components/GameDetail";

export default function Details({games}) {
    const router = useRouter()
    const game = games[0] ?? {}
    console.log(router.query)
    return (
            <div>
                <GameDetail game={game} />
            </div>
    )
}

export async function getServerSideProps(context) {
    console.log(context)
    const url = new URL ('/api/igdb/games/byId', process.env.NEXT_PUBLIC_BTB_API_URL)
    url.searchParams.set('id', context.query.gid)
    const res = await fetch(url.toString())
    const games = await res.json()

    return {
        props: {
            games,
        },
    }
}
