import { ResponderItem } from '@prisma/client'
import prisma from '../../prisma'
/**
 * @returns an array containing all responder items for the specified responder ID
 */
export default async function getResponderItemList(
  responderId: number
): Promise<ResponderItem[]> {
  const respondersItems: ResponderItem[] = await prisma.responderItem.findMany({
    where: {
      responderId: responderId,
    },
    include: {
      itemType: true,
    },
  })
  return respondersItems
}
