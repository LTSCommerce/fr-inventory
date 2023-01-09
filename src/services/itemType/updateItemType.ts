import { ItemType } from '@prisma/client'
import prisma from '../../prisma'

export type ItemTypeUpdate = Omit<ItemType, 'createdAt' | 'updatedAt'>
export type ItemTypeInsert = Omit<ItemTypeUpdate, 'id'>

async function insertItemType(data: ItemTypeInsert): Promise<ItemType> {
  const result = await prisma.itemType.create({
    data: data,
  })
  return result
}

export default async function updateItemType(
  data: ItemTypeUpdate
): Promise<ItemType> {
  if (data.id < 0) {
    // eslint-disable-next-line
    const insertData = (({ id, ...clone }) => clone)(data)
    return insertItemType(insertData)
  }
  const result = await prisma.itemType.update({
    where: {
      id: data.id,
    },
    data: data,
  })
  return result
}
