import Head from 'next/head'
// import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Box from '@mui/material/Box'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import getResponderList from '../src/services/responder/getResponderList'
import { InferGetStaticPropsType } from 'next'

const columns: GridColumns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 90,
  },
  {
    field: 'name',
    headerName: 'Name',
    editable: true,
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'callsign',
    headerName: 'Call Sign',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'createdAt',
    headerName: 'Created',
    width: 150,
    editable: false,
    valueFormatter: (params) => new Date(params?.value),
  },
  {
    field: 'updatedAt',
    headerName: 'Updated',
    width: 150,
    editable: false,
    valueFormatter: (params) => new Date(params?.value),
  },
]

export const getStaticProps = async () => {
  const data = await getResponderList()
  const dataClean = JSON.parse(JSON.stringify(data))
  return {
    props: {
      data: dataClean,
    }, // will be passed to the page component as props
  }
}

export default function Home({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
      </main>
    </>
  )
}
