import { consoleMocker, httpMocker } from '../../__utils__/mocker'
import handler from '../../../pages/api/responder'
import prisma from '../../../src/prisma'
import { ResponderUpdate } from '../../../src/services/responder/updateResponder'

describe('api/responder', () => {
  // remove/clear all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks()
  })
  test('gets the list of responders', async () => {
    const { req, res } = httpMocker()
    const consoleError = consoleMocker('error')
    await handler(req, res)
    expect(consoleError).toHaveBeenCalledTimes(0)
    expect(consoleError.mock.lastCall).toBeFalsy()
    expect(res.statusCode).toBe(200)
    // @see https://basarat.gitbook.io/typescript/type-system/type-assertion#double-assertion
    const body = res._getJSONData()
    expect(body.length).toBeGreaterThan(3)
  })

  test('it can update a responder', async () => {
    const testResponder = await prisma.responder.findFirstOrThrow()
    const updateData:ResponderUpdate = {
      id: testResponder.id,
      name: 'foo',
      callsign: testResponder.callsign,
    }
    const { req, res } = httpMocker('POST')
    req._setBody(updateData as unknown as Body)
    const consoleError = consoleMocker('error')
    await handler(req, res)
    expect(consoleError).toHaveBeenCalledTimes(0)
    expect(consoleError.mock.lastCall).toBeFalsy()
    expect(res.statusCode).toBe(200)
    const body = res._getJSONData()
    expect(body.id).toEqual(updateData.id)
    expect(body.name).toEqual(updateData.name)
    expect(body.callsign).toEqual(updateData.callsign)
  })
  test('it returns an error response on invalid responder ID', async () => {
    const testResponder = await prisma.responder.findFirstOrThrow()
    const updateData:ResponderUpdate = {
      id: 999,
      name: 'foo',
      callsign: testResponder.callsign,
    }
    const { req, res } = httpMocker('POST')
    req._setBody(updateData as unknown as Body)
    const consoleError = consoleMocker('error')
    await handler(req, res)
    expect(consoleError).toHaveBeenCalledTimes(1)
    expect(consoleError.mock.lastCall?.[0].message ?? '').toMatch(/Record to update not found/)
    const body = res._getJSONData()
    expect(res.statusCode).toBe(400)
    expect(body.error).toMatch(/^DB error: \(P2025\)/)
  })
})
