import { consoleMocker, httpMocker } from '../../__utils__/mocker'
import handler from '../../../pages/api/itemtype'
import prisma from '../../../src/prisma'
import { ItemTypeUpdate } from '../../../src/services/itemType/updateItemType'

describe('api/itemType', () => {
  // remove/clear all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks()
  })
  test('gets the list of itemTypes', async () => {
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

  test('it can update a itemType', async () => {
    const testItemType = await prisma.itemType.findFirstOrThrow()
    const updateData: ItemTypeUpdate = {
      id: testItemType.id,
      name: 'foo',
      hasBattery: true,
      hasExpiryDate: false,
      minimum: 1,
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
  test('it returns an error response on invalid itemType ID', async () => {
    const testItemType = await prisma.itemType.findFirstOrThrow()
    const updateData = {
      id: 999,
      name: 'foo',
      callsign: testItemType.callsign,
    }
    const { req, res } = httpMocker('POST')
    req._setBody(updateData as unknown as Body)
    const consoleError = consoleMocker('error')
    await handler(req, res)
    expect(consoleError).toHaveBeenCalledTimes(1)
    expect(consoleError.mock.lastCall[0].message).toMatch(
      /Record to update not found/
    )
    const body = res._getJSONData()
    expect(res.statusCode).toBe(400)
    expect(body.error).toMatch(/^DB error: \(P2025\)/)
  })
})
