import * as React from 'react'

/**
 * Our custom services to load or persist data
 */
import { ItemTypeUpdate } from '../services/itemType/updateItemType'
import { ItemType, ItemTypeGroup } from '@prisma/client'
import { deleteItemTypeApi, updateItemTypeApi } from '../api-client/itemType'

import { GridColumns } from '@mui/x-data-grid'
import CrudDataGrid, {
  CreateEntityFn,
  DeleteEntityFn,
  selectValueFormatter,
  SingleSelectOption,
  UpdateEntityFn,
} from './CrudDataGrid'

interface ItemTypeCrudProps {
  rows: ItemType[]
  itemTypeGroupList: ItemTypeGroup[]
  itemTypeGroupValues: SingleSelectOption[]
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
      headerName: 'Expiry Date?',
      description: 'Has Expiry Date?',
      editable: true,
      type: 'boolean',
      flex: 1,
      minWidth: 30,
    },
    {
      field: 'hasSerialNumber',
      headerName: 'Serial?',
      description: 'Has Serial?',
      editable: true,
      type: 'boolean',
      flex: 1,
      minWidth: 30,
    },
    {
      field: 'hasSwasft',
      headerName: 'SWASFT?',
      description: 'Has SWASFT?',
      editable: true,
      type: 'boolean',
      flex: 1,
      minWidth: 30,
    },
    {
      field: 'hasModel',
      headerName: 'Model?',
      description: 'Has Model?',
      editable: true,
      type: 'boolean',
      flex: 1,
      minWidth: 30,
    },
    {
      field: 'hasBattery',
      headerName: 'Battery?',
      description: 'Has Battery?',
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
      field: 'infoUrl',
      headerName: 'Info URL',
      editable: true,
      type: 'string',
      renderCell: (params) =>
        params.row.infoUrl ? <a href="${params.row.infoUrl}">info</a> : '',
    },
    {
      field: 'itemTypeGroupId',
      headerName: 'Group',
      editable: true,
      type: 'singleSelect',
      valueOptions: props.itemTypeGroupValues,
      valueFormatter: selectValueFormatter,
    },
  ]

  const createEntityFn: CreateEntityFn = async () => {
    return await updateItemTypeApi({
      id: -1,
      name: '',
      hasBattery: false,
      hasExpiryDate: false,
      minimum: 1,
      hasModel: false,
      hasSerialNumber: false,
      hasSwasft: false,
      infoUrl: null,
      itemTypeGroupId: null,
    })
  }

  const updateEntityFn: UpdateEntityFn = async (updatedRow) => {
    const updateData: ItemTypeUpdate = {
      id: updatedRow.id,
      name: updatedRow.name,
      hasBattery: updatedRow.hasBattery,
      hasExpiryDate: updatedRow.hasExpiryDate,
      minimum: updatedRow.minmum,
      hasModel: updatedRow.hasModel,
      hasSerialNumber: updatedRow.hasSerialNumber,
      hasSwasft: updatedRow.hasSwasft,
      infoUrl: updatedRow.infoUrl,
      itemTypeGroupId: updatedRow.itemTypeGroupId,
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
