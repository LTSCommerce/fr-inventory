import { GridRowId } from '@mui/x-data-grid'
import { ItemType } from '@prisma/client'
import { ItemTypeUpdate } from '../services/itemType/updateItemType'

export async function getItemTypeListApi(): Promise<ItemType[]> {
  const response = await fetch('/api/itemType', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const list = await response.json()
  return list
}

export async function updateItemTypeApi(
  data: ItemTypeUpdate
): Promise<ItemType> {
  const response = await fetch('/api/itemType', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const updated = await response.json()
  return updated
}

export async function deleteItemTypeApi(id: GridRowId) {
  const response = await fetch('/api/itemType/', {
    method: 'DELETE',
    body: JSON.stringify(id),
  })
  const updated = await response.json()
  return updated
}
