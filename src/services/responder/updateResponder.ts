import { Responder } from '@prisma/client'
import prisma from '../../prisma'

export type ResponderUpdate = Omit<Responder, 'createdAt' | 'updatedAt'>

export default async function updateResponder(
  data: ResponderUpdate
): Promise<Responder> {
  const result = await prisma.responder.update({
    where: {
      id: data.id,
    },
    data: data,
  })
  return result
}

