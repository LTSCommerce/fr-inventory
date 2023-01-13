import * as React from 'react'

/**
 * Our custom services to load or persist data
 */
import { ItemTypeUpdate } from '../services/itemType/updateItemType'
import { ItemType } from '@prisma/client'
import { deleteItemTypeApi, updateItemTypeApi } from '../api-client/itemType'

import {  GridColumns } from '@mui/x-data-grid'
import CrudDataGrid, {
  CreateEntityFn,
  DeleteEntityFn,
  UpdateEntityFn,
} from './CrudDataGrid'

interface ItemTypeCrudProps {
  rows: ItemType[]
}

export default function ResponderCrud(props: ItemTypeCrudProps) {
  const fieldColumns: GridColumns = [
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
      field: 'hasExpiryDate',
      headerName: 'Has Expiry Date?',
      editable: true,
      type: 'boolean',
      flex: 1,
      minWidth: 30,
    },
    {
      field: 'hasBattery',
      headerName: 'Has Battery?',
      editable: true,
      type: 'boolean',
      flex: 1,
      minWidth: 30,
    },
    {
      field: 'minimum',
      headerName: 'Minimum',
      editable: true,
      type: 'nummber',
      flex: 1,
      minWidth: 50,
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

  const createEntityFn: CreateEntityFn = async () => {
    return await updateItemTypeApi({
      id: -1,
      name: '',
      hasBattery: false,
      hasExpiryDate: false,
      minimum: 1,
    })
  }

  const updateEntityFn: UpdateEntityFn = async (updatedRow) => {
    const updateData: ItemTypeUpdate = {
      id: updatedRow.id,
      name: updatedRow.name,
      hasBattery: updatedRow.hasBattery,
      hasExpiryDate: updatedRow.hasExpiryDate,
      minimum: updatedRow.minmum,
    }
    // Make the HTTP request to save in the backend
    return await updateItemTypeApi(updateData)
  }

  const deleteEntityFn: DeleteEntityFn = (id) => {
    deleteItemTypeApi(id)
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
