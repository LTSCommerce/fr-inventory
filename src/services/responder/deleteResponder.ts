import prisma from '../../prisma'

export default async function deleteResponder(id: string) {
  const idInt = Number(id)
  if (idInt < 0) {
    // its a "new" ID and has not been persisted, so no further action required
    return
  }
  await prisma.responder.delete({
    where: { id: idInt },
  })
}
