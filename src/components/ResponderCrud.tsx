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
import BallotIcon from '@mui/icons-material/Ballot'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertProps } from '@mui/material/Alert'

/**
 * Our custom services to load or persist data
 */

import { ResponderUpdate } from '../services/responder/updateResponder'
import { Responder } from '@prisma/client'
import { deleteResponderApi, updateResponderApi } from '../api-client/responder'
import { useRouter } from 'next/router'

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props

  const handleClick = async () => {
    const newRow: Responder = await updateResponderApi({
      id: -1,
      name: '',
      callsign: '',
    })
    setRows((oldRows) => [...oldRows, newRow])
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [newRow.id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
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

interface ResponderCrudProps {
  rows: Responder[]
}

export default function ResponderCrud(props: ResponderCrudProps) {
  const [rows, setRows] = React.useState(props.rows)

  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  )
  const router = useRouter()

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
              key="saveAction"
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key="cancelAction"
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
            key="editAction"
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="deleteAction"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="viewItemsAction"
            icon={<BallotIcon />}
            label="View Items"
            onClick={() => {
              router.push(`/responder-items/${id}`)
            }}
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

  const deleteRow = (id: GridRowId) => {
    setRows(rows.filter((row: Responder) => row.id !== id))
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    deleteResponderApi(id)
    deleteRow(id)
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })
    if (id < 0) {
      deleteRow(id)
    }
  }

  const processRowUpdate = React.useCallback(
    async (updatedRow: GridRowModel) => {
      const updateData: ResponderUpdate = {
        id: updatedRow.id,
        callsign: updatedRow.callsign,
        name: updatedRow.name,
      }
      // Make the HTTP request to save in the backend
      const response = await updateResponderApi(updateData)
      setSnackbar({
        children: 'responder successfully saved',
        severity: 'success',
      })

      return response
    },
    []
  )

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    setSnackbar({ children: error.message, severity: 'error' })
  }, [])

  return (
    <>
      <Box sx={{ height: 800, width: '100%' }}>
        <DataGrid
          rows={rows}
          rowModesModel={rowModesModel}
          editMode="row"
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
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
    </>
  )
}
