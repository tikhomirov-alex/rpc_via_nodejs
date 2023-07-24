import { Channel } from 'amqplib'
import log4js from 'log4js'

export default class Producer {
  constructor(private channel : Channel) {}

  private logger = log4js.getLogger()

  async produceMessages(
    data : any,
    correlationId : string,
    replyToQueue : string
  ) {
    this.logger.info('[*] Response: %s', data)
    this.channel.sendToQueue(
      replyToQueue, 
      Buffer.from(JSON.stringify(data)), 
      { correlationId: correlationId }
    )
  }
}
