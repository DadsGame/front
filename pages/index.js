import TopCardsList from "../components/TopCardsList.js";
import Header from "../components/Header.js";
import {parseCookies} from "../lib/parseCookies.js";
import {withCookies} from "react-cookie";
import SearchCard from "../components/SearchCard.js";


 function Home({games, cookies}) {

    return (
        <div>
            {cookies.get('user')}
            <div>
                <TopCardsList games={games}/>
            </div>
        </div>
    )
}

export async function getStaticProps() {
    const res = await fetch('http://localhost:8000/api/igdb/topten')
    const games = await res.json()

    return {
        props: {
            games,
        },
    }
}

export default withCookies(Home);

