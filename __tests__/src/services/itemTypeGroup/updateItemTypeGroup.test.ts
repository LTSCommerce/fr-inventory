import updateItemTypeGroup, {
  ItemTypeGroupUpdate,
} from '../../../../src/services/itemTypeGroup/updateItemTypeGroup'
import prisma from '../../../../src/prisma'

describe(updateItemTypeGroup, () => {
  test('it can update responder name', async () => {
    const testItemTypeGroup = await prisma.itemTypeGroup.findFirstOrThrow()
    const updateData: ItemTypeGroupUpdate = {
      id: testItemTypeGroup.id,
      notes: 'bkah',
      name: 'foo',
    }
    const updatedItemTypeGroup = await updateItemTypeGroup(updateData)
    expect(updatedItemTypeGroup.name).toEqual('foo')
    expect(updatedItemTypeGroup.notes).toEqual(updateData.notes)
  })
  test('it can create a new responder when id is negative', async () => {
    const createData: ItemTypeGroupUpdate = {
      id: -1,
      name: 'foo',
      notes: 'kjhaksjhdasd',
    }
    const created = await updateItemTypeGroup(createData)
    expect(created.name).toEqual('foo')
    expect(created.id).not.toEqual(createData.id)
    prisma.responder.delete({ where: { id: created.id } })
  })
})
