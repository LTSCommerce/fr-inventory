/**
 * This is our singleton DB connection
 * Any service that needs access to the client should import this file
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prismaclient-in-long-running-applications
 */
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
