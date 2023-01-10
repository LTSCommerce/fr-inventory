import { ResponderItem } from '@prisma/client'
import prisma from '../../prisma'

export type ResponderItemUpdate = Omit<ResponderItem, 'createdAt' | 'updatedAt'>
export type ResponderItemInsert = Omit<ResponderItemUpdate, 'id'>

async function insertResponderItem(
  data: ResponderItemInsert
): Promise<ResponderItem> {
  const result = await prisma.responderItem.create({
    data: data,
  })
  return result
}

export default async function updateResponderItem(
  data: ResponderItemUpdate
): Promise<ResponderItem> {
  if (data.id < 0) {
    // eslint-disable-next-line
    const insertData = (({ id, ...clone }) => clone)(data)
    return insertResponderItem(insertData)
  }
  const result = await prisma.responderItem.update({
    where: {
      id: data.id,
    },
    data: data,
  })
  return result
}
