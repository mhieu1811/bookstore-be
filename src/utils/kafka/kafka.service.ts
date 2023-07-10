import { Kafka, Producer } from 'kafkajs';
import { topics } from './topics';
import * as dotenv from 'dotenv';

dotenv.config();

export default class KafkaService {
  private kafka: Kafka;
  private producer: any;
  private static instance: KafkaService = new KafkaService();

  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.CLIENT_ID,
      brokers: JSON.parse(process.env.BROKERS ? process.env.BROKERS : ''),
    });
  }

  public static getInstance(): KafkaService {
    return this.instance;
  }

  public async connect() {
    this.producer = this.kafka.producer();
    await this.producer.connect().then(() => {
      console.log('producer connected');
    });
  }

  public async createTopic() {
    const admin = this.kafka.admin();

    await admin.connect();
    admin.createTopics({
      waitForLeaders: true,
      topics: topics,
    });
  }

  public async sendMessage(topic: string, message: Object) {
    const value = JSON.stringify(message);
    const messages = [{ value }];
    try {
      await this.producer.send({
        topic,
        messages,
      });
      console.log('successful send message', messages);
    } catch (error) {
      console.log('failed to send message', error);
    }
  }
}
