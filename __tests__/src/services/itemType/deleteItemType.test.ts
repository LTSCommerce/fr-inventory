import prisma from '../../../../src/prisma'
import deleteItemType from '../../../../src/services/itemType/deleteItemType'
describe(deleteItemType, () => {
  test('it will delete by ID', async () => {
    const created = await prisma.itemType.create({
      data: {
        name: 'foo',
      },
    })
    deleteItemType(String(created.id))
  })
})
