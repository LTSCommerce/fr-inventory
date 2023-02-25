import { Box } from '@mui/system'
import { GridCellParams, GridColumns } from '@mui/x-data-grid'
import * as React from 'react'

import StaticDataGrid from './StaticDataGrid'
import clsx from 'clsx'

type ItemState =
  | 'fine'
  | 'low'
  | 'expiryClose'
  | 'batteryLow'
  | 'expired'
  | 'batteryDead'
  | 'missing'
  | 'unrequired'

type ItemStateOption = {
  colour: string
  description: string
}

type ItemStatesMap = Record<ItemState, ItemStateOption>
const ItemStates: ItemStatesMap = {
  fine: {
    colour: 'green',
    description: 'item is in kit and all is fine.',
  },
  low: {
    colour: 'orange',
    description: 'item is in kit but low quantity',
  },
  expiryClose: {
    colour: 'orange',
    description: 'item is in kit but close to expiry date',
  },
  batteryLow: {
    colour: 'orange',
    description: 'item is in kit but low battery',
  },
  expired: {
    colour: 'red',
    description: 'item is in kit but past expiry date',
  },
  batteryDead: {
    colour: 'red',
    description: 'item is in kit but battery is empty',
  },
  missing: {
    colour: 'red',
    description: 'item is not in kit but is needed',
  },
  unrequired: {
    colour: 'white',
    description: 'item is not in kit and is not required',
  },
} as const

type ResponderCol = {
  responderName: string
  itemState: itemState
  batteryPercent: number | null
}

export type SummaryData = {
  id: number
  itemTypeName: string
  totalNeed: number
  totalSpare: number
  responderCols: ResponderCol[]
}

interface SummaryDataProps {
  rows: SummaryData[]
}

export const SummaryDummyRows: SummaryData[] = [
  {
    id: 1,
    itemTypeName: 'item 1',
    totalNeed: 1,
    totalSpare: 2,
    responderCols: [
      {
        responderName: 'responder 1',
        batteryPercent: null,
        itemState: 'fine',
      },
      {
        responderName: 'responder 2',
        batteryPercent: null,
        itemState: 'batteryDead',
      },
      {
        responderName: 'responder 3',
        batteryPercent: null,
        itemState: 'expired',
      },
      {
        responderName: 'responder 4',
        batteryPercent: null,
        itemState: 'low',
      },
    ],
  },
  {
    id: 2,
    itemTypeName: 'item 2',
    totalNeed: 0,
    totalSpare: 1,
    responderCols: [
      {
        responderName: 'responder 1',
        batteryPercent: null,
        itemState: 'missing',
      },
      {
        responderName: 'responder 2',
        batteryPercent: null,
        itemState: 'expiryClose',
      },
      {
        responderName: 'responder 3',
        batteryPercent: null,
        itemState: 'expired',
      },
      {
        responderName: 'responder 4',
        batteryPercent: null,
        itemState: 'fine',
      },
    ],
  },
]

export default function SummaryTable(props: SummaryDataProps) {
  const fieldColumns: GridColumns = [
    {
      field: 'itemTypeName',
      headerName: 'Item',
      type: 'string',
      width: 200,
    },
    {
      field: 'totalNeed',
      headerName: 'Needed',
      type: 'number',
      width: 3,
    },
    {
      field: 'totalSpare',
      headerName: 'Spare',
      type: 'number',
      width: 3,
    },
  ]
  const firstRowResponders = props.rows[0].responderCols
  firstRowResponders.forEach(function (responder: ResponderCol) {
    fieldColumns.push({
      field: responder.responderName,
      headerName: responder.responderName,
      type: 'string',
      width: 200,
      cellClassName: (params: GridCellParams<ItemState>) =>
        params.value != undefined
          ? clsx('itemstate', ItemStates[params.value].colour)
          : '',
    })
  })

  return (
    <Box
      sx={{
        '& .itemstate.red': {
          backgroundColor: 'rgba(157, 255, 118, 0.49)',
          color: '#1a3e72',
          fontWeight: '600',
        },
        '& .itemstate.orange': {
          backgroundColor: '#d47483',
          color: '#1a3e72',
          fontWeight: '600',
        },
        '& .itemstate.green': {
          backgroundColor: '#91cca4',
          color: '#1a3e72',
          fontWeight: '600',
        },
      }}
    >
      <StaticDataGrid
        rows={props.rows}
        fieldColumns={fieldColumns}
      ></StaticDataGrid>
    </Box>
  )
}
