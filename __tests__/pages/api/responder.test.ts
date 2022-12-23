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
    req._setBody(updateJson as unknown as Body)
    await handler(req, res)
    expect(res.statusCode).toBe(200)
    const body = res._getJSONData()
    expect(body.id).toEqual(updateData.id)
    expect(body.name).toEqual(updateData.name)
    expect(body.callsign).toEqual(updateData.callsign)
  })
  test('it returns an error response on invalid responder ID', async () => {
    const testResponder = await prisma.responder.findFirstOrThrow()
    const updateData = {
      id: -999,
      name: 'foo',
      callsign: testResponder.callsign,
    }
    const updateJson = JSON.stringify(updateData)
    const { req, res } = httpMocker('POST')
    req._setBody(updateJson as unknown as Body)
    const consoleError = jest
      .spyOn(global.console, 'error')
      .mockImplementation(() => {})
    await handler(req, res)
    expect(consoleError).toHaveBeenCalledTimes(1)
    consoleError.mockReset()
    const body = res._getJSONData()
    expect(res.statusCode).toBe(400)
    expect(body.error).toMatch(/^DB error: \(P2025\)/)
  })
})
