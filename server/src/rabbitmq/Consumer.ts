import { Channel, ConsumeMessage } from 'amqplib'
import log4js from 'log4js'
import MessageHandler from '../messageHandler'

export default class Consumer {
  constructor(private channel : Channel, private rpcQueue : string) {}

  private logger = log4js.getLogger()

  async consumeMessages() {
    this.logger.info('[*] Ready to consume messages...')

    this.channel.consume(
      this.rpcQueue,
      async (msg : ConsumeMessage) => {
        const { correlationId, replyTo } = msg.properties;
        const operation = msg.properties.headers.function;
        if (!correlationId || !replyTo) {
          this.logger.error('[x] Missing some properties...')
        }

        const parsed = JSON.parse(msg.content.toString())
        this.logger.debug('Consumed: %s', parsed)
        await MessageHandler.handle(
          operation,
          parsed,
          correlationId,
          replyTo
        )
      },
      {
        noAck: true,
      }
    );
  }
}
