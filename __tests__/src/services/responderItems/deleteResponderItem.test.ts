import prisma from '../../../../src/prisma'
import deleteResponderItem from '../../../../src/services/responderItem/deleteResponderItem'

describe(deleteResponderItem, () => {
  test('it will delete by ID', async () => {
    const createdItemType = await prisma.itemType.create({
      data: { name: 'foo' },
    })
    const createdResponder = await prisma.responder.create({
      data: {
        name: 'bar',
        callsign: 'baz',
      },
    })
    const createdResponderItem = await prisma.responderItem.create({
      data: {
        itemTypeId: createdItemType.id,
        responderId: createdResponder.id,
      },
    })
    deleteResponderItem(String(createdResponderItem.id))
    prisma.itemType.delete({ where: { id: createdItemType.id } })
    prisma.responder.delete({ where: { id: createdResponder.id } })
  })
})
