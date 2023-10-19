import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
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
      <h1 className="text-5xl mb-10">
        Welcome to Chess-TS!
      </h1>

      <div className={styles.grid}>
        <Link href='/'>
          <div
            className={styles.card}
            style={{
              cursor: 'pointer',
            }}
          >
            <h2>Play</h2>
            <p>Play a game of chess against the AI, or locally!</p>
          </div>
        </Link>
        <Link href='/account'>
          <div
            className={styles.card}
            style={{
              cursor: 'pointer',
            }}
          >
            <h2>Account</h2>
            <p>Save your games, review games, and more!</p>
          </div>
        </Link>
        <Link href='/about'>
          <div
            className={styles.card}
            style={{
              cursor: 'pointer',
            }}
          >
            <h2>About</h2>
            <p>Learn about the project!</p>
          </div>
        </Link>
        <Link href='/source'>
          <div
            className={styles.card}
            style={{
              cursor: 'pointer',
            }}
          >
            <h2>Source Code</h2>
            <p>See the code powering the app!</p>
          </div>
        </Link>
      </div>
    </main>
  </div>
  )
}

export default Home
