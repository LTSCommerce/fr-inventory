import { Responder } from '@prisma/client'
import prisma from '../../prisma'

type responderUpdate = Omit<Responder, 'createdAt' | 'updatedAt'>

export default async function updateResponder(
  data: responderUpdate
): Promise<Responder> {
  const result = await prisma.responder.update({
    where: {
      id: data.id,
    },
    data: data,
  })
  return result
}
