import Head from 'next/head'
// import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import * as React from 'react'

import getResponderList from '../src/services/responder/getResponderList'
import ResponderCrud from '../src/components/ResponderCrud'
import { Responder, ItemType } from '@prisma/client'
import ItemTypeCrud from '../src/components/ItemTypeCrud'
import getItemTypeList from '../src/services/itemType/getItemTypeList'
import { Tab, Tabs } from '@mui/material'
import { Box } from '@mui/system'

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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function Home(props: HomeProps) {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <>
      <Head>
        <title>Inventory</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>
      <main className={styles.main}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Responders" {...a11yProps(0)} />
          <Tab label="Item Types" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <h1>Responders</h1>
          <ResponderCrud rows={props.responderRows} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <h1>Item Types</h1>
          <ItemTypeCrud rows={props.itemTypeRows} />
        </TabPanel>
      </main>
    </>
  )
}
