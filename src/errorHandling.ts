import { Prisma } from '@prisma/client'

export type ErrorWithMessage = {
  message: string
}

export type HttpCode = 400 | 500

function isPrismaError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientValidationError
  )
}

function getPrismaErrorWithMessage(error: unknown): ErrorWithMessage {
  let message = ''
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    message = getPrismaMessage(error.code, error.message)
    const metaMessage = error.meta ? error.meta.toString : ''
    return new Error(`${message} ${metaMessage}`)
  }
  if (
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientValidationError
  ) {
    return new Error(getPrismaMessage(error.name, error.message))
  }
  throw new Error(`error ${typeof error} is not a Prisma error`)
}

function getHttpCode(error: unknown): HttpCode {
  if (
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientKnownRequestError
  ) {
    return 400
  }
  return 500
}

function getPrismaMessage(code: string, message: string): string {
  const prismaMessage = `DB error: (${code}) ${message}`
  return prismaMessage
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

function toErrorWithMessage(error: unknown): ErrorWithMessage {
  if (isPrismaError(error)) {
    return getPrismaErrorWithMessage(error)
  }
  if (isErrorWithMessage(error)) {
    return error
  }

  try {
    return new Error(JSON.stringify(error))
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(error))
  }
}

function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message
}
/**
 * This function will take any error and will create a message to be returned to the user
 * Prisma errors are processed specially
 * @param error
 * @returns [message string, http code]
 */
export function handleErrorGetMessageAndHttpCode(
  error: unknown
): [string, HttpCode] {
  console.error(error)
  const message = getErrorMessage(error)
  const code = getHttpCode(error)
  return [message, code]
}
