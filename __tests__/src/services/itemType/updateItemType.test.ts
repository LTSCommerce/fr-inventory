import updateItemType, {
  ItemTypeUpdate,
} from '../../../../src/services/itemType/updateItemType'
import prisma from '../../../../src/prisma'

describe(updateItemType, () => {
  test('it can update responder name', async () => {
    const testItemType = await prisma.itemType.findFirstOrThrow()
    const updateData: ItemTypeUpdate = {
      id: testItemType.id,
      name: 'foo',
      hasBattery: true,
      hasExpiryDate: true,
      minimum: 1,
    }
    const updatedItemType = await updateItemType(updateData)
    expect(updatedItemType.name).toEqual('foo')
    expect(updatedItemType.hasBattery).toEqual(updateData.hasBattery)
  })
  test('it can create a new responder when id is negative', async () => {
    const createData: ItemTypeUpdate = {
      id: -1,
      name: 'foo',
      hasBattery: true,
      hasExpiryDate: true,
      minimum: 1,
    }
    const created = await updateItemType(createData)
    expect(created.name).toEqual('foo')
    expect(created.id).not.toEqual(createData.id)
    prisma.responder.delete({ where: { id: created.id } })
  })
})
