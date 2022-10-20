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
        <h1 className="text-5xl">
          Welcome to Chess-TS!
        </h1>
      </main>
    </div>
  )
}

export default Home
