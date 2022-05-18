import {useRouter} from "next/router";

export default function Details() {
    const router = useRouter()
    console.log(router.query)
    return (
        <div>
            <div>Page de détail du jeu {router.query.gid}</div>
        </div>
    )
}