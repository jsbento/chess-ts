import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {

  useEffect(() => {
    const goTest = async () => {
      const res = await fetch('http://localhost:3000/api/hello')
      const data = await res.json()
      console.log(data)
    }
    goTest()
  })

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
