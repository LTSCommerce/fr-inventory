import type { NextApiRequest, NextApiResponse } from 'next'
import updateResponderItem from '../../../src/services/responderItem/updateResponderItem'
import getResponderItemList from '../../../src/services/responderItem/getResponderItemList'
import deleteResponderItem from '../../../src/services/responderItem/deleteResponderItem'
import { handleErrorGetMessageAndHttpCode } from '../../../src/errorHandling'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { rid } = req.query
    if (typeof rid !== 'string') {
      throw new Error('invalid responder ID provided')
    }
    const requestMethod = req.method
    switch (requestMethod) {
      case 'POST':
        const updateData = req.body
        const updated = await updateResponderItem(updateData)
        res.status(200).json(updated)
        break

      case 'GET':
        const responderItems = await getResponderItemList(+rid)
        res.status(200).json(responderItems)
        break

      case 'DELETE':
        await deleteResponderItem(rid)
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
