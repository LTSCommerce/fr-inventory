import type { NextApiRequest, NextApiResponse } from 'next'
import updateItemTypeGroup from '../../src/services/itemTypeGroup/updateItemTypeGroup'
import getItemTypeGroupList from '../../src/services/itemTypeGroup/getItemTypeGroupList'
import deleteItemTypeGroup from '../../src/services/itemTypeGroup/deleteItemTypeGroup'
import { handleErrorGetMessageAndHttpCode } from '../../src/errorHandling'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const requestMethod = req.method
    switch (requestMethod) {
      case 'POST':
        const updateData = req.body
        const updated = await updateItemTypeGroup(updateData)
        res.status(200).json(updated)
        break

      case 'GET':
        const itemTypeGroups = await getItemTypeGroupList()
        res.status(200).json(itemTypeGroups)
        break

      case 'DELETE':
        await deleteItemTypeGroup(req.body)
        res.status(200).json('deleted')
        break

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
        res.status(405).end(`Method ${requestMethod} Not Allowed`)
        break
    }
  } catch (err) {
    const [errorMessage, httpCode] = handleErrorGetMessageAndHttpCode(err)
    res.status(httpCode).json({ error: errorMessage })
  }
}
