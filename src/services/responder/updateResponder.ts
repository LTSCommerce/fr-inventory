import { Responder } from '@prisma/client'
import prisma from '../../prisma'

export type ResponderUpdate = Omit<Responder, 'createdAt' | 'updatedAt'>
export type ResponderInsert = Omit<ResponderUpdate, 'id'>

async function insertResponder(data: ResponderInsert): Promise<Responder> {
  const result = await prisma.responder.create({
    data: data,
  })
  return result
}

export default async function updateResponder(
  data: ResponderUpdate
): Promise<Responder> {
  if (data.id < 0) {
    // eslint-disable-next-line
    const insertData = (({ id, ...clone }) => clone)(data)
    return insertResponder(insertData)
  }
  const result = await prisma.responder.update({
    where: {
      id: data.id,
    },
    data: data,
  })
  return result
}
