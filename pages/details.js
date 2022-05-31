import {useRouter} from "next/router";

export default function Details({games}) {
    const router = useRouter()
    const game = games[0] ?? {}
    console.log(router.query)
    return (
        <div>
            <div>Page de détail du jeu {router.query.gid}</div>
            <div>{JSON.stringify(games)}</div>
            <div>{JSON.stringify(game.aggregated_rating)}</div>
            <div>{JSON.stringify(game.name)}</div>
            <div>{JSON.stringify(game.summary)}</div>
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
