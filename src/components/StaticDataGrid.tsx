import * as React from 'react'
/**
 * Mui Imports
 * @see https://mui.com/
 */
import {
  DataGrid,
  GridColumns,
  GridRowModesModel,
  GridRowId,
  GridColDef,
  GridValueFormatterParams,
} from '@mui/x-data-grid'

import { SummaryData } from './SummaryTable'

// a single type to account for any of our static data types
// do wonder if there is a better way to do this?
export type DataItem = SummaryData // | EtcData

// a method that will create any extra grid actions that are required
export type ExtraActionsFactory = (id: GridRowId) => JSX.Element[]

// a select option, an array of which is used for singleSelect columns
export type SingleSelectOption = { value: number | null; label: string }

interface DataProps {
  rows: DataItem[]
  fieldColumns: GridColumns
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

export const selectValueFormatter = (params: GridValueFormatterParams) => {
  const colDef = params.api.getColumn(params.field)
  const option = colDef.valueOptions.find(
    ({ value: optionValue }: { value: string }) => params.value === optionValue
  )

  return option.label
}

export default function StaticDataGrid(props: DataProps) {
  const rows = props.rows
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  )
  const [pageSize, setPageSize] = React.useState(10)

  //merge the passed in field columns with the standard edit columns
  let columns: GridColumns = [    
    ...props.fieldColumns,
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
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
      />
    </>
  )
}
