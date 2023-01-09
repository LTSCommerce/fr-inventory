import prisma from '../../prisma'

export default async function deleteItemType(id: string) {
  const idInt = Number(id)
  if (idInt < 0) {
    // its a "new" ID and has not been persisted, so no further action required
    return
  }
  await prisma.itemType.delete({
    where: { id: idInt },
  })
}
