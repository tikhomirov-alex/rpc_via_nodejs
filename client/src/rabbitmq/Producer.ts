import { Channel, ConsumeMessage } from 'amqplib'
import EventEmitter from 'events'
import log4js from 'log4js'
import { randomUUID } from 'crypto'

export default class Producer {
  constructor(
    private channel : Channel,
    private replyQueueName : string,
    private eventEmitter : EventEmitter    
  ) {}

  private logger = log4js.getLogger()

  async produceMessages(data : any) {
    const uuid = randomUUID()
    let flag = true
    
    this.logger.info('[*] The correlation ID: %s', uuid)
    this.channel.sendToQueue(
      process.env.RPC_QUEUE,
      Buffer.from(JSON.stringify(data)),
      {
        replyTo: this.replyQueueName,
        correlationId: uuid,
        expiration: 10,
        headers: {
          function: data.operation,
        },
      }
    )

    let timer =  setTimeout(() => {
      console.warn('[w!] Request deleted') 
      if (flag) {        
        let reply : ConsumeMessage = {
          content : Buffer.from(JSON.stringify({success: false, msg: 'Timeout error'})), 
          fields: null,
          properties: null
        }
        this.eventEmitter.emit(uuid, reply)   
        flag = false
      }     
    }, 5000)
    
    return new Promise((resolve, reject) => {
      this.eventEmitter.once(uuid, async (data) => {
        const reply = JSON.parse(data.content.toString())
        timer.unref()
        flag = false
        resolve(reply)
      });      
    });
  }
}
