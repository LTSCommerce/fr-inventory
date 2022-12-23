import { httpMocker } from '../../__utils__/mocker'
import handler from '../../../pages/api/responder'
import prisma from '../../../src/prisma'

describe('api/responder', () => {
  test('gets the list of responders', async () => {
    const { req, res } = httpMocker()
    await handler(req, res)

    expect(res.statusCode).toBe(200)
    // @see https://basarat.gitbook.io/typescript/type-system/type-assertion#double-assertion
    const body = res._getJSONData()
    expect(body).toHaveLength(3)
  })

  test('it can update a responder', async () => {
    const testResponder = await prisma.responder.findFirstOrThrow()
    const updateData = {
      id: testResponder.id,
      name: 'foo',
      callsign: testResponder.callsign,
    }
    const updateJson = JSON.stringify(updateData)
    const { req, res } = httpMocker('POST')
    req._setBody(updateJson)
    await handler(req, res)
    const body = res._getJSONData()
    expect(body.id).toEqual(updateData.id)
    expect(body.name).toEqual(updateData.name)
    expect(body.callsign).toEqual(updateData.callsign)
  })
})
