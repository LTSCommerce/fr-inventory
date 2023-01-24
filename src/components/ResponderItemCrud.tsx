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
  formatDate,
  selectValueFormatter,
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
      field: 'itemTypeId',
      headerName: 'Item',
      type: 'singleSelect',
      valueOptions: itemTypeValues,
      valueFormatter: selectValueFormatter,
      width: 200,
      editable: true,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      minWidth: 100,
      type: 'number',
      editable: true,
    },
    {
      field: 'expiry',
      headerName: 'Expiry',
      editable: true,
      minWidth: 100,
      type: 'date',
      valueFormatter: formatDate,
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
