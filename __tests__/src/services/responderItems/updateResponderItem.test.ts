import updateResponderItem from '../../../../src/services/responderItem/updateResponderItem'
import prisma from '../../../../src/prisma'

describe(updateResponderItem, () => {
  test('it can update responderItem item', async () => {
    const testresponderItem = await prisma.responderItem.findFirstOrThrow()
    const updateData = {...testresponderItem}
    updateData.quantity += 100
    const updatedResponderItem = await updateResponderItem(updateData)
    expect(updatedResponderItem.quantity).toEqual(updateData.quantity)
  })
  test('it can create a new responderItem when id is negative', async () => {
    const testresponderItem = await prisma.responderItem.findFirstOrThrow()
    const createData = testresponderItem
    createData.id = -1
    const created = await updateResponderItem(createData)
    expect(created.id).not.toEqual(createData.id)
    prisma.responderItem.delete({ where: { id: created.id } })
  })
})
