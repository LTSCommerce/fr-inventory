import prisma from '../../../../src/prisma'
import deleteItemTypeGroup from '../../../../src/services/itemTypeGroup/deleteItemTypeGroup'
describe(deleteItemTypeGroup, () => {
  test('it will delete by ID', async () => {
    const created = await prisma.itemTypeGroup.create({
      data: {
        name: 'foo',
      },
    })
    deleteItemTypeGroup(String(created.id))
  })
})
