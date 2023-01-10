import { consoleMocker, httpMocker } from '../../__utils__/mocker'
import handler from '../../../pages/api/responderItem/[rid]'
import prisma from '../../../src/prisma'
import { ResponderItemUpdate } from '../../../src/services/responderItem/updateResponderItem'

describe('api/responderItem', () => {
  // remove/clear all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks()
  })
  test('gets the list of responderItems', async () => {
    const testResponderItem = await prisma.responderItem.findFirstOrThrow()
    const { req, res } = httpMocker()
    const consoleError = consoleMocker('error')
    req.query.rid=testResponderItem.responderId.toString()
    await handler(req, res)
    // expect(consoleError).toHaveBeenCalledTimes(0)
    expect(consoleError.mock.lastCall).toBeFalsy()
    expect(res.statusCode).toBe(200)
    // @see https://basarat.gitbook.io/typescript/type-system/type-assertion#double-assertion
    const body = res._getJSONData()
    expect(body.length).toBeGreaterThan(3)
  })

  test('it can update a responderItem', async () => {
    const testResponderItem = await prisma.responderItem.findFirstOrThrow()
    const updateData: ResponderItemUpdate = {
      id: testResponderItem.id,
      quantity: testResponderItem.quantity + 100,
      itemTypeId: testResponderItem.itemTypeId,
      responderId: testResponderItem.responderId,
      expiry: testResponderItem.expiry,
    }
    const { req, res } = httpMocker('POST')
    req.query.rid=testResponderItem.responderId.toString()
    req._setBody(updateData as unknown as Body)
    const consoleError = consoleMocker('error')
    await handler(req, res)
    expect(consoleError).toHaveBeenCalledTimes(0)
    expect(consoleError.mock.lastCall).toBeFalsy()
    expect(res.statusCode).toBe(200)
    const body = res._getJSONData()
    expect(body.id).toEqual(updateData.id)
    expect(body.quantity).toEqual(updateData.quantity)
  })
  test('it returns an error response on invalid responderItem ID', async () => {
    const testResponderItem = await prisma.responderItem.findFirstOrThrow()
    const updateData: ResponderItemUpdate = {
      id: 999,
      quantity: testResponderItem.quantity,
      itemTypeId: testResponderItem.itemTypeId,
      responderId: testResponderItem.responderId,
      expiry: testResponderItem.expiry,
    }
    const { req, res } = httpMocker('POST')
    req.query.rid=testResponderItem.responderId.toString()
    req._setBody(updateData as unknown as Body)
    const consoleError = consoleMocker('error')
    await handler(req, res)
    expect(consoleError).toHaveBeenCalledTimes(1)
    expect(consoleError.mock.lastCall?.[0].message ?? '').toMatch(
      /Record to update not found/
    )
    const body = res._getJSONData()
    expect(res.statusCode).toBe(400)
    expect(body.error).toMatch(/^DB error: \(P2025\)/)
  })
})
