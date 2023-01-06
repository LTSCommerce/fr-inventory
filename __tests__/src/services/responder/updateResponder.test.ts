import updateResponder from '../../../../src/services/responder/updateResponder'
import prisma from '../../../../src/prisma'

describe(updateResponder, () => {
  test('it can update responder name', async () => {
    const testResponder = await prisma.responder.findFirstOrThrow()
    const updateData = {
      id: testResponder.id,
      name: 'foo',
      callsign: testResponder.callsign,
    }
    const updatedResponder = await updateResponder(updateData)
    expect(updatedResponder.name).toEqual('foo')
    expect(updatedResponder.callsign).toEqual(updateData.callsign)
  })
  test('it can create a new responder when id is negative', async () => {
    const createData = {
      id: -1,
      name: 'foo',
      callsign: 'bar',
    }
    const created = await updateResponder(createData)
    expect(created.name).toEqual('foo')
    expect(created.id).not.toEqual(createData.id)
    prisma.responder.delete({ where: { id: created.id } })
  })
})
