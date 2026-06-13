/**
 * Communication Module
 * Communication hub for messaging, notifications, and channel management.
 */

// Re-export communication features
export * from './components/messages';
export * from './components/notifications';
export * from './components/notification-templates';
export * from './components/message-templates';
export * from './components/communication-channels';
export * from './components/message-logs';
export * from './components/broadcasts';

// Module metadata
export const communicationModuleId = 'communication' as const;
export const communicationModuleName = 'Communication Hub';
export const communicationModuleDescription =
  'Messaging, notifications, and communication channel management';
