import { Responder } from '@prisma/client'
import prisma from '../../prisma'
/**
 * @returns an array containing all responders
 */
export default async function getResponderList(): Promise<Responder[]> {
  const responders: Responder[] = await prisma.responder.findMany()
  return responders
}
