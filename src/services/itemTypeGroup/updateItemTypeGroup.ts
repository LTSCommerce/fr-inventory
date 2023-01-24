import { ItemTypeGroup } from '@prisma/client'
import prisma from '../../prisma'

export type ItemTypeGroupUpdate = Omit<ItemTypeGroup, 'createdAt' | 'updatedAt'>
export type ItemTypeGroupInsert = Omit<ItemTypeGroupUpdate, 'id'>

async function insertItemTypeGroup(
  data: ItemTypeGroupInsert
): Promise<ItemTypeGroup> {
  const result = await prisma.itemTypeGroup.create({
    data: data,
  })
  return result
}

export default async function updateItemTypeGroup(
  data: ItemTypeGroupUpdate
): Promise<ItemTypeGroup> {
  if (data.id < 0) {
    // eslint-disable-next-line
    const insertData = (({ id, ...clone }) => clone)(data)
    return insertItemTypeGroup(insertData)
  }
  const result = await prisma.itemTypeGroup.update({
    where: {
      id: data.id,
    },
    data: data,
  })
  return result
}
