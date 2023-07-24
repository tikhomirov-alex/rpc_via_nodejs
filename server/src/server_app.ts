import dotenv from 'dotenv'
import log4js from 'log4js'
import RabbitMQClient from './rabbitmq/RabbitMQClient'

dotenv.config()
const logger = log4js.getLogger()
logger.level = process.env.LOG_LEVEL || log4js.levels.ALL

RabbitMQClient.init()
