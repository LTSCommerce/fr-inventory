import Head from 'next/head'
// import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import * as React from 'react'

import getResponderList from '../src/services/responder/getResponderList'
import ResponderCrud from '../src/components/ResponderCrud'
import { Responder, ItemType, ItemTypeGroup } from '@prisma/client'
import ItemTypeCrud from '../src/components/ItemTypeCrud'
import getItemTypeList from '../src/services/itemType/getItemTypeList'
import { Tab, Tabs } from '@mui/material'
import { Box } from '@mui/system'
import { GetServerSideProps } from 'next'
import { SingleSelectOption } from '../src/components/CrudDataGrid'
import getItemTypeGroupList from '../src/services/itemTypeGroup/getItemTypeGroupList'
import ItemTypeGroupCrud from '../src/components/ItemTypeGroupCrud'
import SummaryTable, { SummaryData, SummaryDummyRows } from '../src/components/SummaryTable'

/**
 * This method loads the data to be used when the page is first loaded up
 * In this page, it creates the list of responders to be shown in the table
 */
export const getServerSideProps: GetServerSideProps = async () => {
  const responders = await getResponderList()
  const responderRows = JSON.parse(JSON.stringify(responders))
  const itemTypes = await getItemTypeList()
  const itemTypeRows = JSON.parse(JSON.stringify(itemTypes))
  const itemTypeGroupList = JSON.parse(
    JSON.stringify(await getItemTypeGroupList())
  )
  const itemTypeGroupValues: SingleSelectOption[] = itemTypeGroupList.map(
    (group: ItemTypeGroup) => ({
      value: group.id,
      label: group.name,
    })
  )
  itemTypeGroupValues.push({ value: null, label: ' - ' })
  return {
    props: {
      responderRows: responderRows,
      itemTypeRows: itemTypeRows,
      itemTypeGroupRows: itemTypeGroupList,
      itemTypeGroupList: itemTypeGroupList,
      itemTypeGroupValues: itemTypeGroupValues,
      summaryRows: SummaryDummyRows
    },
  }
}

interface HomeProps {
  responderRows: Responder[]
  itemTypeRows: ItemType[]
  itemTypeGroupRows: ItemTypeGroup[]
  itemTypeGroupList: ItemTypeGroup[]
  itemTypeGroupValues: SingleSelectOption[]
  summaryRows: SummaryData[]
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
          <Tab label="Item Type Groups" {...a11yProps(2)} />
          <Tab label="Detailed Summary" {...a11yProps(3)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
              <h1>Responders</h1>
              <ResponderCrud rows={props.responderRows} />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <h1>Item Types</h1>
          <ItemTypeCrud
            rows={props.itemTypeRows}
            itemTypeGroupList={props.itemTypeGroupList}
            itemTypeGroupValues={props.itemTypeGroupValues}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <h1>Item Type Groups</h1>
          <ItemTypeGroupCrud rows={props.itemTypeGroupRows} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <h1>Detailed Summary</h1>
          <SummaryTable rows={props.summaryRows} />
        </TabPanel>
      </main>
    </>
  )
}
