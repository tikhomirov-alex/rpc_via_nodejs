import { Channel, Connection, connect } from 'amqplib'
import { EventEmitter } from 'events'
import log4js from 'log4js'
import Consumer from './Consumer'
import Producer from './Producer'

class RabbitMQClient {
  private constructor() {}

  private static instance : RabbitMQClient
  private isInitialized = false

  private producer : Producer
  private consumer : Consumer
  private connection : Connection
  private producerChannel : Channel
  private consumerChannel : Channel

  private eventEmitter: EventEmitter
  private logger = log4js.getLogger()

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RabbitMQClient()
    }
    return this.instance
  }

  async init() {

    if (this.isInitialized) {
      return
    }

    try {
      this.connection = await connect(process.env.URL)

      this.producerChannel = await this.connection.createChannel()
      this.consumerChannel = await this.connection.createChannel()

      const { queue: replyQueueName } = await this.consumerChannel.assertQueue(
        '',
        { exclusive: true }
      )

      this.eventEmitter = new EventEmitter()
      this.producer = new Producer(
        this.producerChannel,
        replyQueueName,
        this.eventEmitter
      )
      this.consumer = new Consumer(
        this.consumerChannel,
        replyQueueName,
        this.eventEmitter
      )

      this.consumer.consumeMessages()

      this.isInitialized = true

      this.connection.on('close', ()=> {
        this.logger.warn('[w!] connection close')
        this.isInitialized = false
      })

      this.connection.on('error', (err)=> {
        this.isInitialized = false
        this.logger.error('[x] RabbitMQ client error: %s', err)
      })

    } catch (err) {
      this.logger.error('[x] RabbitMQ client error: %s', err)
    }
  }
  async produce(data : any) {
    if (!this.isInitialized) {
      this.logger.warn('[w!] Initialization...')
      await this.init()
    }
    return await this.producer.produceMessages(data)
  }  
}

export default RabbitMQClient.getInstance()
