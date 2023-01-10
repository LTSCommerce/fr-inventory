import type { NextApiRequest, NextApiResponse } from 'next'
import updateItemType from '../../src/services/itemType/updateItemType'
import getItemTypeList from '../../src/services/itemType/getItemTypeList'
import deleteItemType from '../../src/services/itemType/deleteItemType'
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
        const updated = await updateItemType(updateData)
        res.status(200).json(updated)
        break

      case 'GET':
        const itemTypes = await getItemTypeList()
        res.status(200).json(itemTypes)
        break

      case 'DELETE':
        await deleteItemType(req.body)
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
