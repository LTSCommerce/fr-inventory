import * as React from 'react'

/**
 * Our custom services to load or persist data
 */
import { ItemTypeGroupUpdate } from '../services/itemTypeGroup/updateItemTypeGroup'
import { ItemTypeGroup } from '@prisma/client'
import {
  deleteItemTypeGroupApi,
  updateItemTypeGroupApi,
} from '../api-client/itemTypeGroup'

import { GridColumns } from '@mui/x-data-grid'
import CrudDataGrid, {
  CreateEntityFn,
  DeleteEntityFn,
  UpdateEntityFn,
} from './CrudDataGrid'

interface ItemTypeGroupCrudProps {
  rows: ItemTypeGroup[]
}

export default function ItemTypeGroupCrud(props: ItemTypeGroupCrudProps) {
  const fieldColumns: GridColumns = [
    {
      field: 'name',
      headerName: 'Name',
      editable: true,
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'notes',
      headerName: 'Notes',
      editable: true,
      flex: 1,
      minWidth: 300,
    },
  ]

  const createEntityFn: CreateEntityFn = async () => {
    return await updateItemTypeGroupApi({
      id: -1,
      name: '',
      notes: '',
    })
  }

  const updateEntityFn: UpdateEntityFn = async (updatedRow) => {
    const updateData: ItemTypeGroupUpdate = {
      id: updatedRow.id,
      name: updatedRow.name,
      notes: updatedRow.notes,
    }
    // Make the HTTP request to save in the backend
    return await updateItemTypeGroupApi(updateData)
  }

  const deleteEntityFn: DeleteEntityFn = (id) => {
    deleteItemTypeGroupApi(id)
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
