import { Kafka, Producer } from 'kafkajs';
import { topics } from './topics';
import { SchemaRegistry, SchemaType } from '@kafkajs/confluent-schema-registry';
import * as dotenv from 'dotenv';

dotenv.config();

export default class KafkaService {
  private kafka: Kafka;
  private producer: any;
  private bookSchemaId: number;
  private static instance: KafkaService = new KafkaService();
  private registry: any;

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
    this.registry = new SchemaRegistry({ host: 'http://0.0.0.0:8081' });
    await this.registrySchema();
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

  private async registrySchema() {
    const bookSchema = `{
      "type": "record",
      "name": "BookMessage",
      "namespace": "Book1",
      "fields": [
        {
          "name": "book",
          "type": {
            "type": "record",
            "name": "Book",
            "fields": [
              {
                "name": "title",
                "type": "string"
              },
              {
                "name": "image",
                "type": "string"
              },
              {
                "name": "quantity",
                "type": "int"
              },
              {
                "name": "price",
                "type": "long"
              },
              {
                "name": "description",
                "type": "string"
              },
              {
                "name": "category",
                "type": "string"
              },
              {
                "name": "isDeleted",
                "type": "boolean"
              },
              {
                "name": "_id",
                "type": "string"
              }
            ]
          }
        },
        {
          "name": "type",
          "type": "string"
        }
      ]
    }`;

    const { id } = await this.registry.register({
      type: SchemaType.AVRO,
      schema: bookSchema,
    });

    this.bookSchemaId = id;
  }

  public async sendMessage(topic: string, message: Object) {
    const value = message;

    const encodedPayload = await this.registry.encode(
      this.bookSchemaId,
      message,
    );
    // const messages = [{ value }];
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            value: encodedPayload,
          },
        ],
      });
      console.log('successful send message', value);
    } catch (error) {
      console.log('failed to send message', error);
    }
  }
}
