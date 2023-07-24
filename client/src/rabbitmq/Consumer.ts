import { Channel, ConsumeMessage } from 'amqplib'
import EventEmitter from 'events'
import log4js from 'log4js'

export default class Consumer {
  constructor(
    private channel : Channel,
    private replyQueueName : string,
    private eventEmitter : EventEmitter
  ) {}

  private logger = log4js.getLogger()

  async consumeMessages() {
    this.logger.info('[*] Ready to consume messages...')

    this.channel.consume(
      this.replyQueueName,
      (msg: ConsumeMessage) => {
        const reply = JSON.parse(msg.content.toString())
        this.logger.info('[*] Reply: %s', reply)
        this.eventEmitter.emit(
          msg.properties.correlationId.toString(),
          msg
        )
      },
      {
        noAck: true,
      }
    )
  }
}
