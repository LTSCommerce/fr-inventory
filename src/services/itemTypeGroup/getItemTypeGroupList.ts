import { ItemTypeGroup } from '@prisma/client'
import prisma from '../../prisma'
/**
 * @returns an array containing all ItemTypeGroups
 */
export default async function getItemTypeGroupList(): Promise<ItemTypeGroup[]> {
  const itemTypeGroups: ItemTypeGroup[] = await prisma.itemTypeGroup.findMany()
  return itemTypeGroups
}
