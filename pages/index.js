import Head from 'next/head'
import styles from '../styles/Home.module.css'
import GameCard from "../components/GameCard";
import Header from "../components/Header";
import CardListSlider from "../components/CardListSlider";

export default function Home({games}) {

  return (
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header>

        </Header>

          <body>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Tutur.js!</a>
          </h1>
        </main>
          <CardListSlider games={games}/>
          </body>

        <footer className={styles.footer}>
          Powered by Us
        </footer>
      </div>
  )
}
export async function getStaticProps() {
    const res = await fetch('http://localhost:8080/games')
    const games = await res.json()
    console.log(games)
    return {
        props: {
            games,
        },
    }
}
