import type { NextApiRequest, NextApiResponse } from 'next'
import updateResponder from '../../src/services/responder/updateResponder'
import getResponderList from '../../src/services/responder/getResponderList'
import deleteResponder from '../../src/services/responder/deleteResponder'
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
        const updated = await updateResponder(updateData)
        res.status(200).json(updated)
        break

      case 'GET':
        const responders = await getResponderList()
        res.status(200).json(responders)
        break

      case 'DELETE':
        await deleteResponder(req.body)
        res.status(200).json('deleted')
        break

      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${requestMethod} Not Allowed`)
        break
    }
  } catch (err) {
    const [errorMessage, httpCode] = handleErrorGetMessageAndHttpCode(err)
    res.status(httpCode).json({ error: errorMessage })
  }
}
