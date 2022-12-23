import Head from 'next/head'
// import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { InferGetStaticPropsType } from 'next'
import * as React from 'react'

/**
 * Mui Imports
 * @see https://mui.com/
 */
import Box from '@mui/material/Box'
import { DataGrid, GridColumns, GridRowModel } from '@mui/x-data-grid'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertProps } from '@mui/material/Alert'

/**
 * Our custom services to load or persist data
 */
import getResponderList from '../src/services/responder/getResponderList'
import { ResponderUpdate } from '../src/services/responder/updateResponder'
import { Responder } from '@prisma/client'

async function updateResponderApi(data: ResponderUpdate): Promise<Responder> {
  const response = await fetch('/api/responder', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const updated = await response.json()
  return JSON.parse(updated)
}
/**
 * This property defines the columns for the grid
 * @see https://mui.com/x/react-data-grid/column-definition/
 */
const columns: GridColumns = [
  {
    field: 'id',
    headerName: 'ID',
    editable: false,
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
    editable: true,
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

/**
 * This method loads the data to be used when the page is first loaded up
 * In this page, it creates the list of responders to be shown in the table
 * @returns
 */
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
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null)

  const handleCloseSnackbar = () => setSnackbar(null)

  const processRowUpdate = React.useCallback(async (newRow: GridRowModel) => {
    const updateData: ResponderUpdate = {
      id: newRow.id,
      callsign: newRow.callsign,
      name: newRow.name,
    }
    // Make the HTTP request to save in the backend
    const response = await updateResponderApi(updateData)
    setSnackbar({
      children: 'responder successfully saved',
      severity: 'success',
    })
    return response
  }, [])
  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    setSnackbar({ children: error.message, severity: 'error' })
  }, [])
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
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
          />
          {!!snackbar && (
            <Snackbar
              open
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              onClose={handleCloseSnackbar}
              autoHideDuration={6000}
            >
              <Alert {...snackbar} onClose={handleCloseSnackbar} />
            </Snackbar>
          )}
        </Box>
      </main>
    </>
  )
}
