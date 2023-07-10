import { ITopicConfig } from 'kafkajs';

export enum KafkaTopics {
  Book = 'book',
  Order = 'order',
}

export const topics: ITopicConfig[] = [
  {
    topic: KafkaTopics.Book,
  },
  {
    topic: KafkaTopics.Order,
  },
];
