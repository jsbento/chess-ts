import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Chess-TS</title>
        <meta name="description" content="Chess with Next.js" />
        <link rel="icon" href="/Chess_klt45.svg" />
      </Head>

      <main className={styles.main}>
        <h1 className="text-6xl">
          Welcome to Chess-TS!
        </h1>

        <div className={styles.grid}>
          <a href="/chess" className={styles.card}>
            <h2>Play &rarr;</h2>
            <p>Play a game of chess!</p>
          </a>

          <a href="/about" className={styles.card}>
            <h2>About &rarr;</h2>
            <p>Read a quick overview of how the project was built.</p>
          </a>

          <a
            href="https://github.com/jsbento/chess-ts"
            className={styles.card}
          >
            <h2>The Code &rarr;</h2>
            <p>Browse through the source code.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export default Home
