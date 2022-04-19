import Head from 'next/head'
import styles from '../styles/Home.module.css'
import TopCardsList from "../components/TopCardsList.js";
import Header from "../components/Header.js";


export default function Home({games}) {

  return (
      <div>
          <Header />
          <div>
              <TopCardsList games={games} />
          </div>
      </div>
  )
}

export async function getStaticProps() {
    const res = await fetch('http://localhost:8000/api/igdb/topten')
    const games = await res.json()
    console.log(games)

    return {
        props: {
            games,
        },
    }
}

