import {withCookies} from "react-cookie";
import React, {useEffect, useState} from "react";
import ClippedDrawer from "../../components/ClippedDrawer";

function Library({cookies}) {
    const [library, updateLibrary] = useState([])
    const token = cookies.get('user') ?? '';
    useEffect(() => {
        async function fetchLibrary() {
            console.log(token)
            const url = new URL('/games/userLibrary', process.env.NEXT_PUBLIC_MAIN_API_URL)
            const res = await fetch(url, {
                headers: {'Authorization': `Bearer ${token}`}
            })
            let response = await res.json()
            console.log(response)
            updateLibrary(response)
        }

        fetchLibrary()
    }, [])

    return (
        <div>
            {/*library.map((game, index) => {
                console.log('game', game)
                return (
                    <div key={index}> {game.idGame}</div>
                )
            })*/
            }
            <ClippedDrawer library={library}/>
        </div>

    )
}

export default withCookies(Library);