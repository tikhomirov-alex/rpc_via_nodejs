import { Channel, Connection, connect } from 'amqplib'
import log4js from 'log4js'
import Consumer from './Consumer'
import Producer from './Producer'

class RabbitMQClient {
  private constructor() {}

  private static instance : RabbitMQClient
  private isInitialized = false

  private logger = log4js.getLogger()

  private producer : Producer
  private consumer : Consumer
  private connection : Connection
  private producerChannel : Channel
  private consumerChannel : Channel

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

      const { queue: rpcQueue } = await this.consumerChannel.assertQueue(
        process.env.RPC_QUEUE,
        { exclusive: true }
      )

      this.producer = new Producer(this.producerChannel)
      this.consumer = new Consumer(this.consumerChannel, rpcQueue)

      this.consumer.consumeMessages()

      this.isInitialized = true
    } catch (err) {
      this.logger.error('RabbitMQ error: %s', err)
    }
  }
  async produce(
    data : any, 
    correlationId : string,
    replyToQueue : string) {
    if (!this.isInitialized) {
      await this.init()
    }
    return await this.producer.produceMessages(
      data,
      correlationId,
      replyToQueue
    )
  }
}

export default RabbitMQClient.getInstance()
