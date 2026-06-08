// RSS Config
export interface RssConfig {
  id?: string;
  isEnabled?: boolean;
  title?: string;
  description?: string;
  feedUrl?: string;
  language?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// RSS Subscriber
export interface CreateSubscriberInput {
  email: string;
}

export interface UpdateSubscriberInput {
  isVerified?: boolean;
  verifyToken?: string | null;
  unsubscribedAt?: Date | null;
}
