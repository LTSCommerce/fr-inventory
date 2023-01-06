import prisma from '../../../../src/prisma'
import deleteResponder from '../../../../src/services/responder/deleteResponder'

describe(deleteResponder, () => {
  test('it will delete by ID', async () => {
    const created = await prisma.responder.create({
      data: {
        name: 'foo',
        callsign: 'bar',
      },
    })
    deleteResponder(String(created.id))
  })
})
