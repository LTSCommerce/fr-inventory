import Head from 'next/head'
// import { Inter } from '@next/font/google'
import styles from '../../styles/Home.module.css'
import * as React from 'react'
import { ItemType, Responder, ResponderItem } from '@prisma/client'
import prisma from '../../src/prisma'
import getResponderItemList from '../../src/services/responderItem/getResponderItemList'
import ResponderItemCrud from '../../src/components/ResponderItemCrud'
import { GetServerSideProps } from 'next'
import getItemTypeList from '../../src/services/itemType/getItemTypeList'

export type ItemTypeValue = { value: number; label: string }
export type ItemTypeValues = ItemTypeValue[]

/**
 * This method loads the data to be used when the page is first loaded up
 * In this page, it creates the list of responders to be shown in the table
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const rid = context.params?.rid
  if (rid === undefined) {
    throw new Error('no responder ID provided')
  }
  const currentResponder: Responder = await prisma.responder.findFirstOrThrow({
    where: { id: +rid },
  })

  const itemTypeList = await getItemTypeList()

  const itemTypeValues: ItemTypeValues = itemTypeList.map((itemType) => ({
    value: itemType.id,
    label: itemType.name,
  }))

  const responderItems: ResponderItem[] = await getResponderItemList(
    currentResponder.id
  )

  return {
    props: {
      currentResponder: JSON.parse(JSON.stringify(currentResponder)),
      itemTypeList: JSON.parse(JSON.stringify(itemTypeList)),
      itemTypeValues: JSON.parse(JSON.stringify(itemTypeValues)),
      responderItems: JSON.parse(JSON.stringify(responderItems)),
    },
  }
}

interface ResponderItemProps {
  currentResponder: Responder
  itemTypeList: ItemType[]
  itemTypeValues: ItemTypeValues
  responderItems: ResponderItem[]
}

export default function ResponderItems(props: ResponderItemProps) {
  return (
    <>
      <Head>
        <title>Inventory</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>
      <main className={styles.main}>
        <h1>{props.currentResponder.name} Items</h1>
        <ResponderItemCrud
          currentResponder={props.currentResponder}
          rows={props.responderItems}
          itemTypeList={props.itemTypeList}
          itemTypeValues={props.itemTypeValues}
        ></ResponderItemCrud>
      </main>
    </>
  )
}
