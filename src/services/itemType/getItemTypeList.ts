import { ItemType } from '@prisma/client'
import prisma from '../../prisma'
/**
 * @returns an array containing all Items
 */
export default async function getItemTypeList(): Promise<ItemType[]> {
  const ItemTypes: ItemType[] = await prisma.itemType.findMany()
  return ItemTypes
}
