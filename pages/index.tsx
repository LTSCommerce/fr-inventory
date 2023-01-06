import Head from 'next/head'
// import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import * as React from 'react'

import getResponderList from '../src/services/responder/getResponderList'
import ResponderCrud from '../src/components/ResponderCrud'
import { Responder } from '@prisma/client'

/**
 * This method loads the data to be used when the page is first loaded up
 * In this page, it creates the list of responders to be shown in the table
 */
export const getStaticProps = async () => {
  const responders = await getResponderList()
  const responderRows = JSON.parse(JSON.stringify(responders))
  return {
    props: {
      responderRows: responderRows,
    }    
  }
}

interface HomeProps{
  responderRows:Responder[]
}

export default function Home(
  props:HomeProps
  ) {
  
  return (
    <>
      <Head>
        <title>Inventory</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>
      <main className={styles.main}>
        <h1>Responders</h1>
        <ResponderCrud rows={props.responderRows} />
      </main>
    </>
  )
}
