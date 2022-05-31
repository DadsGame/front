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
    const res = await fetch(new URL ('api/igdb/topten', process.env.NEXT_PUBLIC_BTB_API_URL))
    const games = await res.json()

    return {
        props: {
            games,
        },
    }
}

export default withCookies(Home);

