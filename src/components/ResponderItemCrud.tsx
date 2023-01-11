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
import HomeIcon from '@mui/icons-material/Home'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertProps } from '@mui/material/Alert'

/**
 * Our custom services to load or persist data
 */
import { ResponderItemUpdate } from '../services/responderItem/updateResponderItem'
import { ItemType, Responder, ResponderItem } from '@prisma/client'
import {
  deleteResponderItemApi,
  updateResponderItemApi,
} from '../api-client/responderItem'
import { ItemTypeValues } from '../../pages/responder-items/[rid]'
import { useRouter } from 'next/router'

interface EditToolbarProps {
  currentResponder: Responder
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void
  itemTypeList: ItemType[]
}

function EditToolbar(props: EditToolbarProps) {
  const { currentResponder, setRows, setRowModesModel, itemTypeList } = props
  const router = useRouter()
  const handleClick = async () => {
    const newRow = await updateResponderItemApi({
      id: -1,
      itemTypeId: itemTypeList[0].id,
      responderId: currentResponder.id,
      expiry: itemTypeList[0].hasExpiryDate ? new Date() : null,
      quantity: 0,
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
      <Button
        color="primary"
        startIcon={<HomeIcon />}
        onClick={() => {
          router.push('/')
        }}
      >
        Home
      </Button>
    </GridToolbarContainer>
  )
}

interface ResponderItemCrudProps {
  currentResponder: Responder
  rows: ResponderItem[]
  itemTypeList: ItemType[]
  itemTypeValues: ItemTypeValues
}

export default function ResponderItemCrud(props: ResponderItemCrudProps) {
  const currentResponder: Responder = props.currentResponder
  const [rows, setRows] = React.useState(props.rows)
  const [itemTypeList, setItemTypeList] = React.useState(props.itemTypeList)
  const [itemTypeValues, setItemTypeValues] = React.useState(
    props.itemTypeValues
  )
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
      field: 'itemTypeId',
      headerName: 'Item',
      type: 'singleSelect',
      valueOptions: itemTypeValues,
      valueGetter: ({ value, colDef }) => {
        const option = colDef.valueOptions.find(
          ({ value: optionValue }) => value === optionValue
        )
        return option.label
      },
      width: 200,
      editable: true,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      editable: true,
    },
    {
      field: 'expiry',
      headerName: 'Expiry',
      editable: true,
      type: 'date',
      valueFormatter: (params) => new Date(params?.value),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 150,
      editable: false,
      type: 'date',
      valueFormatter: (params) => new Date(params?.value),
    },
    {
      field: 'updatedAt',
      headerName: 'Updated',
      width: 150,
      editable: false,
      type: 'date',
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
    setRows(rows.filter((row: ResponderItem) => row.id !== id))
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    deleteResponderItemApi(id)
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
      const updateData: ResponderItemUpdate = {
        id: updatedRow.id,
        expiry: updatedRow.expiry,
        itemTypeId: updatedRow.itemTypeId,
        responderId: currentResponder.id,
        quantity: updatedRow.quantity,
      }
      // Make the HTTP request to save in the backend
      const response = await updateResponderItemApi(updateData)
      setSnackbar({
        children: 'itemType successfully saved',
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
          pageSize={100}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
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
            toolbar: {
              currentResponder,
              setRows,
              setRowModesModel,
              itemTypeList,
            },
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
