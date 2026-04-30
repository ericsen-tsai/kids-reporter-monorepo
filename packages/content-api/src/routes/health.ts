import { prisma } from '@kids-reporter/db'
import { emitStructured } from '@kids-reporter/logger'
import express from 'express'

export function createHealthRouter() {
  const router = express.Router()
  router.get('/healthz', async (_req, res) => {
    res.status(200).json({})
  })

  router.get('/readyz', async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`
      res.status(200).json({})
    } catch (e) {
      emitStructured({
        severity: 'ERROR',
        message: 'Readiness check failed',
        error: e instanceof Error ? e.stack : String(e),
      })
      res.status(503).json({
        error: {
          code: 'service_unavailable',
          message: 'Database unavailable',
        },
      })
    }
  })

  router.get('/health', async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`
      res.status(200).json({ timestamp: new Date().toISOString() })
    } catch (e) {
      const timestamp = new Date().toISOString()
      emitStructured({
        severity: 'ERROR',
        message: 'Health check failed',
        error: e instanceof Error ? e.stack : String(e),
      })
      res.status(503).json({
        error: {
          code: 'service_unavailable',
          message: 'Database unavailable',
          details: { timestamp },
        },
      })
    }
  })
  return router
}
