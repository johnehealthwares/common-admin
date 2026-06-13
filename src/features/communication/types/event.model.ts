import { EventType, MessageStatus } from './enums';

export type EventSnapshot = {
  [key: string]: any;
};

export type EventMetadata = {
  correlationId: string;
  traceId: string;
  spanId: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  sourceIP?: string;
  customMetadata?: Record<string, any>;
};

export type MessageEvent = {
  id: string;
  eventType: EventType;
  messageId: string;
  correlationId?: string;
  timestamp: Date;
  sequenceNumber: number;
  sourceAE: string;
  targetAE?: string;
  status: MessageStatus;
  metadata: EventMetadata;
  snapshot: EventSnapshot;
  duration?: number; // milliseconds
  errorMessage?: string;
  stackTrace?: string;
  createdAt: Date;
};

export type EventStream = {
  messageId: string;
  events: MessageEvent[];
  status: MessageStatus;
  startTime: Date;
  endTime?: Date;
  totalDuration?: number;
  errorCount: number;
};

export type MessageEventAuditEntry = {
  id: string;
  messageId: string;
  events: MessageEvent[];
  sourceAE: string;
  targetAE: string;
  messageType: string;
  status: MessageStatus;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
  retainedUntil?: Date;
};

export type EventTracer = {
  startTrace(messageId: string, correlationId: string): void;
  recordEvent(event: MessageEvent): Promise<void>;
  getEventStream(messageId: string): Promise<EventStream>;
  getAuditTrail(messageId: string): Promise<MessageEventAuditEntry>;
};
