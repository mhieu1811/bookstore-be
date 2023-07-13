import { ITopicConfig } from 'kafkajs';

export enum KafkaTopics {
  Book = 'book',
}

export const topics: ITopicConfig[] = [
  {
    topic: KafkaTopics.Book,
  },
];
