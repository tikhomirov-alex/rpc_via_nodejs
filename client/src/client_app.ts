import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import log4js from 'log4js'
import RabbitMQClient from './rabbitmq/RabbitMQClient'

const server = express()
server.use(express.json())
server.use(cors())

dotenv.config()

const logger = log4js.getLogger()
logger.level = process.env.LOG_LEVEL || log4js.levels.ALL

server.post('/execute', async (req, res) => {
  logger.debug('[*] Request body: %s', req.body)
  const result = await RabbitMQClient.produce(req.body)
  res.send({ result })
})

const port = process.env.PORT || 5000
server.listen(port, async () => {
  logger.info(`[*] Client app has been started on port ${port}`)
  RabbitMQClient.init()
})
