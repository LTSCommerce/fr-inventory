import {
  PrismaClient,
  // Prisma,
  Responder,
  // ItemType,
  // ResponderItem,
} from '@prisma/client'

/**
 *
 * @returns an array containing all responders
 */
export default async function getResponderList(): Promise<Responder[]> {
  const prisma = new PrismaClient()
  const responders: Responder[] = await prisma.responder.findMany()
  return responders
}
