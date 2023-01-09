import Head from 'next/head'
// import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import * as React from 'react'

import getResponderList from '../src/services/responder/getResponderList'
import ResponderCrud from '../src/components/ResponderCrud'
import { Responder, ItemType } from '@prisma/client'
import ItemTypeCrud from '../src/components/ItemTypeCrud'
import getItemTypeList from '../src/services/itemType/getItemTypeList'

/**
 * This method loads the data to be used when the page is first loaded up
 * In this page, it creates the list of responders to be shown in the table
 */
export const getStaticProps = async () => {
  const responders = await getResponderList()
  const responderRows = JSON.parse(JSON.stringify(responders))
  const itemTypes = await getItemTypeList()
  const itemTypeRows = JSON.parse(JSON.stringify(itemTypes))
  return {
    props: {
      responderRows: responderRows,
      itemTypeRows: itemTypeRows,
    },
  }
}

interface HomeProps {
  responderRows: Responder[]
  itemTypeRows: ItemType[]
}

export default function Home(props: HomeProps) {
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
        <h1>Item Types</h1>
        <ItemTypeCrud rows={props.itemTypeRows} />
      </main>
    </>
  )
}
