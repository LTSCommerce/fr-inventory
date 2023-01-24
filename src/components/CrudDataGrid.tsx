import * as React from 'react'
/**
 * Mui Imports
 * @see https://mui.com/
 */
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
  GridColDef,
  GridValueFormatterParams,
} from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertProps } from '@mui/material/Alert'
import { ItemType, Responder, ResponderItem } from '@prisma/client'
import {
  ResponderInsert,
  ResponderUpdate,
} from '../services/responder/updateResponder'
import {
  ResponderItemInsert,
  ResponderItemUpdate,
} from '../services/responderItem/updateResponderItem'
import {
  ItemTypeInsert,
  ItemTypeUpdate,
} from '../services/itemType/updateItemType'

// a single type to account for any of our entities managed with Prisma
// do wonder if there is a better way to do this?
export type Entity = Responder | ItemType | ResponderItem
export type EntityUpdate =
  | ResponderUpdate
  | ItemTypeUpdate
  | ResponderItemUpdate
export type EntityInsert =
  | ResponderInsert
  | ItemTypeInsert
  | ResponderItemInsert

// processing row update include making the API calls
export type ProcessRowUpdatePromise = Promise<Entity>

// crud functions for making API calls
export type CreateEntityFn = () => Promise<Entity>
export type UpdateEntityFn = (updatedRow: GridRowModel) => Promise<Entity>
export type DeleteEntityFn = (id: GridRowId) => void

// a method that will create any extra grid actions that are required
export type ExtraActionsFactory = (id: GridRowId) => GridActionsCellItem[]

// a select option, an array of which is used for singleSelect columns
export type SingleSelectOption = { value: number | null; label: string }

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void
  createEntityFn: CreateEntityFn
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel, createEntityFn } = props

  const handleClick = async () => {
    const newRow: Entity = await createEntityFn()
    setRows((oldRows) => [...oldRows, newRow])
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [newRow.id]: { mode: GridRowModes.Edit },
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

interface CrudProps {
  rows: Entity[]
  fieldColumns: GridColumns
  createEntityFn: CreateEntityFn
  updateEntityFn: UpdateEntityFn
  deleteEntityFn: DeleteEntityFn
  extraActions?: ExtraActionsFactory
}

// value formatter function for date columns
export const formatDate = (params: GridValueFormatterParams): string => {
  const dateString = params?.value
  if (null === dateString) {
    return '-'
  }
  const date = new Date(dateString)
  const today = new Date()
  if (date.getDate() === today.getDate()) {
    return date.toLocaleTimeString()
  }
  return date.toLocaleDateString()
}

export const selectValueFormatter=(params: GridValueFormatterParams) => {
  const colDef = params.api.getColumn(params.field)
  const option = colDef.valueOptions.find(
    ({ value: optionValue }) => params.value === optionValue
  )

  return option.label
}

export default function CrudDataGrid(props: CrudProps) {
  const [rows, setRows] = React.useState(props.rows)
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  )
  const [pageSize, setPageSize] = React.useState(10)

  //merge the passed in field columns with the standard edit columns
  let columns: GridColumns = [
    ...props.fieldColumns,
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 100,
      editable: false,
      valueFormatter: formatDate,
    },
    {
      field: 'updatedAt',
      headerName: 'Updated',
      width: 100,
      editable: false,
      valueFormatter: formatDate,
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
          // any exta actions buttons are dropped here
          ...(() => {
            return props.extraActions === undefined
              ? []
              : props.extraActions(id)
          })(),
        ]
      },
    },
  ]

  // ensure columns all have description set
  columns = columns.map((column: GridColDef) => ({
    ...column,
    description: column.description ? column.description : column.headerName,
    width: column.width ? column.width : 30,
  }))

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
    setRows(rows.filter((row: Entity) => row.id !== id))
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    props.deleteEntityFn(id)
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
      // Make the HTTP request to save in the backend
      const response = await props.updateEntityFn(updatedRow)
      setSnackbar({
        children: 'responder successfully saved',
        severity: 'success',
      })

      return response
    },
    [props]
  )

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    setSnackbar({ children: error.message, severity: 'error' })
  }, [])

  const createEntityFn = props.createEntityFn

  return (
    <>
      <DataGrid
        rows={rows}
        rowModesModel={rowModesModel}
        columns={columns}
        disableColumnMenu={true}
        autoHeight={true}
        //pagesize stuff
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 20, 50, 100]}
        onPageSizeChange={(newPage) => setPageSize(newPage)}
        disableSelectionOnClick
        //row editing stuff
        editMode="row"
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        experimentalFeatures={{ newEditingApi: true }}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        //toolbar stuff
        components={{
          Toolbar: EditToolbar,
        }}
        componentsProps={{
          toolbar: { setRows, setRowModesModel, createEntityFn },
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
    </>
  )
}
