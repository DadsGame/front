import TopCardsList from "../components/TopCardsList.js";
import Header from "../components/Header.js";


export default function Home({games}) {

    return (
        <div>
            <Header/>
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

