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
})
