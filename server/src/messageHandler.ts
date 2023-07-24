import log4js from 'log4js'
import rabbitClient from './rabbitmq/RabbitMQClient'

export default class MessageHandler {

  private static logger = log4js.getLogger()

  static async handle(
    operation : string,
    data : any,
    correlationId : string,
    replyTo : string
  ) {
    let response = {}
     
    const { num1, num2 } = data

    this.logger.debug('[*] The operation is: %s', operation)

    switch (operation) {
      case 'multiply':
        await delay(4000)
        response = num1 * num2
        break

      case 'sum':
        await delay(2000)
        response = num1 + num2
        break

      default:
        response = 0
        break
    }

    await rabbitClient.produce(response, correlationId, replyTo)
  }
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}