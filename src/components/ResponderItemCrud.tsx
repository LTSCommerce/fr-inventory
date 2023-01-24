import * as React from 'react'

/**
 * Our custom services to load or persist data
 */
import { ResponderItemUpdate } from '../services/responderItem/updateResponderItem'
import { ItemType, Responder, ResponderItem } from '@prisma/client'
import {
  deleteResponderItemApi,
  updateResponderItemApi,
} from '../api-client/responderItem'

import { GridColumns } from '@mui/x-data-grid'
import CrudDataGrid, {
  CreateEntityFn,
  DeleteEntityFn,
  SingleSelectOption,
  UpdateEntityFn,
} from './CrudDataGrid'

interface ResponderItemCrudProps {
  currentResponder: Responder
  rows: ResponderItem[]
  itemTypeList: ItemType[]
  itemTypeValues: SingleSelectOption[]
}

export default function ResponderCrud(props: ResponderItemCrudProps) {
  const currentResponder: Responder = props.currentResponder
  const [itemTypeList /*setItemTypeList*/] = React.useState(props.itemTypeList)
  const [itemTypeValues /*setItemTypeValues*/] = React.useState(
    props.itemTypeValues
  )
  const fieldColumns: GridColumns = [
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
        if (colDef.valueOptions === undefined) {
          throw new Error('Undefind value options')
        }
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
  ]

  const createEntityFn: CreateEntityFn = async () => {
    return await updateResponderItemApi({
      id: -1,
      itemTypeId: itemTypeList[0].id,
      responderId: currentResponder.id,
      expiry: itemTypeList[0].hasExpiryDate ? new Date() : null,
      quantity: 0,
    })
  }
  const updateEntityFn: UpdateEntityFn = async (updatedRow) => {
    const updateData: ResponderItemUpdate = {
      id: updatedRow.id,
      expiry: updatedRow.expiry,
      itemTypeId: updatedRow.itemTypeId,
      responderId: currentResponder.id,
      quantity: updatedRow.quantity,
    }
    // Make the HTTP request to save in the backend
    return await updateResponderItemApi(updateData)
  }
  const deleteEntityFn: DeleteEntityFn = (id) => {
    deleteResponderItemApi(id)
  }
  return (
    <CrudDataGrid
      rows={props.rows}
      fieldColumns={fieldColumns}
      createEntityFn={createEntityFn}
      updateEntityFn={updateEntityFn}
      deleteEntityFn={deleteEntityFn}
    ></CrudDataGrid>
  )
}
