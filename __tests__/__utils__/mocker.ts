import {
  createMocks,
  RequestMethod,
  MockRequest,
  MockResponse,
} from 'node-mocks-http'
import type { NextApiRequest, NextApiResponse } from 'next'

export function httpMocker(method: RequestMethod = 'GET'): {
  req: MockRequest<NextApiRequest>
  res: MockResponse<NextApiResponse>
} {
  const {
    req,
    res,
  }: { req: MockRequest<NextApiRequest>; res: MockResponse<NextApiResponse> } =
    createMocks({ method })
  req.headers = {
    'Content-Type': 'application/json',
  }
  return { req, res }
}
