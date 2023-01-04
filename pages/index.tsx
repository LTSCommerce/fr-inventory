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
import {
  DataGrid,
  GridColumns,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowParams,
  MuiEvent,
  GridRowId,
  GridEventListener,
} from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
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
  return updated
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void
}

// We keep a track of the new row ID and decrement for each row.
// Negative IDs will be regarded as null when being submitted and then the real ID will be generated
// When the row is saved
let newRowId = 0

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props

  const handleClick = () => {
    const id = --newRowId
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        name: '',
        callsign: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        isNew: true,
      },
    ])
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }))
  }

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  )
}

/**
 * This method loads the data to be used when the page is first loaded up
 * In this page, it creates the list of responders to be shown in the table
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
  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  )
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
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ]
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null)

  const handleCloseSnackbar = () => setSnackbar(null)

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true
  }

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true
  }

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id))
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find((row) => row.id === id)
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id))
    }
  }

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
        <Box sx={{ height: 800, width: '100%' }}>
          <DataGrid
            rows={rows}
            rowModesModel={rowModesModel}
            editMode="row"
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5]}
            // checkboxSelection
            disableSelectionOnClick
            onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            experimentalFeatures={{ newEditingApi: true }}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            components={{
              Toolbar: EditToolbar,
            }}
            componentsProps={{
              toolbar: { setRows, setRowModesModel },
            }}
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
