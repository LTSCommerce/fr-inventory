import { GridRowId } from '@mui/x-data-grid'
import { Responder } from '@prisma/client'
import { ResponderUpdate } from '../services/responder/updateResponder'

export async function updateResponderApi(
  data: ResponderUpdate
): Promise<Responder> {
  const response = await fetch('/api/responder', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const updated = await response.json()
  return updated
}

export async function deleteResponderApi(id: GridRowId) {
  const response = await fetch('/api/responder/', {
    method: 'DELETE',
    body: JSON.stringify(id),
  })
  const updated = await response.json()
  return updated
}
