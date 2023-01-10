import { GridRowId } from '@mui/x-data-grid'
import { ResponderItem } from '@prisma/client'
import { ResponderItemUpdate } from '../services/responderItem/updateResponderItem'

export async function updateResponderItemApi(
  data: ResponderItemUpdate
): Promise<ResponderItem> {
  const response = await fetch(`/api/responderItem/${data.id}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const updated = await response.json()
  return updated
}

export async function deleteResponderItemApi(id: GridRowId) {
  const response = await fetch(`/api/responderItem/${id}`, {
    method: 'DELETE'
  })
  const updated = await response.json()
  return updated
}
