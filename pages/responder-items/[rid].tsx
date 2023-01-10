// import Head from 'next/head'
// // import { Inter } from '@next/font/google'
// import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import * as React from 'react'
import { Responder, ResponderItem } from '@prisma/client'
import prisma from '../../src/prisma'
import getResponderItemList from '../../src/services/responderItem/getResponderItemList'

export default async function ResponderItems() {
  const router = useRouter()
  const { rid } = router.query
  if (rid === undefined) {
    throw new Error('no responder ID provided')
  }
  const responder: Responder = await prisma.responder.findFirstOrThrow({
    where: { id: +rid },
  })
  const responderItems: ResponderItem[] = await getResponderItemList(+rid)
  return (
    <>
      <h1>{responder.name} Items</h1>
    </>
  )
}
