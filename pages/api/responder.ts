import type { NextApiRequest, NextApiResponse } from 'next'
import updateResponder from '../../src/services/responder/updateResponder'
import getResponderList from '../../src/services/responder/getResponderList'
import { handleErrorGetMessageAndHttpCode } from '../../src/errorHandling'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const requestMethod = req.method
    switch (requestMethod) {
      case 'POST':
        const updateData = JSON.parse(req.body)
        const updated = await updateResponder(updateData)
        res.status(200).json(updated)
        break

      case 'GET':
        const responders = await getResponderList()
        res.status(200).json(responders)
        break

      default:
        res.status(400).json({ message: 'Invalid request' })
        break
    }
  } catch (err) {
    const [errorMessage, httpCode] = handleErrorGetMessageAndHttpCode(err)
    res.status(httpCode).json({ error: errorMessage })
  }
}
