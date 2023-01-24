import { GridRowId } from '@mui/x-data-grid'
import { ItemTypeGroup } from '@prisma/client'
import { ItemTypeGroupUpdate } from '../services/itemTypeGroup/updateItemTypeGroup'

export async function getItemTypeGroupListApi(): Promise<ItemTypeGroup[]> {
  const response = await fetch('/api/itemTypeGroup', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const list = await response.json()
  return list
}

export async function updateItemTypeGroupApi(
  data: ItemTypeGroupUpdate
): Promise<ItemTypeGroup> {
  const response = await fetch('/api/itemTypeGroup', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const updated = await response.json()
  return updated
}

export async function deleteItemTypeGroupApi(id: GridRowId) {
  const response = await fetch('/api/itemTypeGroup/', {
    method: 'DELETE',
    body: JSON.stringify(id),
  })
  const updated = await response.json()
  return updated
}
