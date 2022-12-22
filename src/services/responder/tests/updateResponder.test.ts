import updateResponder from '../updateResponder'
import prisma from '../../../prisma'

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
