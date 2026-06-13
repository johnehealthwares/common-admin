import type { Column, Field, FieldGroup, Option } from '@/features/rxsoft/types';
import type { ModelConfig } from '@/features/shared/model-schema';
import { conversationApi } from '@/lib/conversation-api';
import {
  CHANNEL_TYPE_OPTIONS,
  CONVERSATION_STATE_OPTIONS,
  CONVERSATION_STATUS_OPTIONS,
  EXCHANGE_DIRECTION_OPTIONS,
  EXCHANGE_STATUS_OPTIONS,
  PROCESSING_STRATEGY_OPTIONS,
  PROCESS_MODE_OPTIONS,
  QUESTION_TYPE_OPTIONS,
  RENDER_MODE_OPTIONS,
  WORKFLOW_STATUS_OPTIONS,
  WORKFLOW_STEP_TYPE_OPTIONS,
} from '../types/constants';

const option = (value?: unknown, fallbackLabel?: unknown): Option | null => {
  if (value == null || value === '') {
    return null;
  }
  return {
    value: String(value),
    label: String(fallbackLabel ?? value),
  };
};

const optionValue = (value: unknown) => {
  if (value && typeof value === 'object' && 'value' in value) {
    return String((value as Option).value);
  }
  return value ? String(value) : undefined;
};

const jsonObject = (value: unknown) =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const jsonArray = (value: unknown) => (Array.isArray(value) ? value : []);

const text = (value: unknown) => String(value ?? '');

const bool = (value: unknown, fallback = false) => (typeof value === 'boolean' ? value : fallback);

const numberValue = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const asyncField = (name: string, label: string, endpoint: string, labelKey = 'name'): Field => ({
  name,
  label,
  type: 'async-select',
  col: 6,
  searchParam: {
    endpoint,
    queryParam: 'search',
    minChars: 0,
    valueKey: 'id',
    labelKey,
  },
});

const selectField = (name: string, label: string, options: Option[], col = 6): Field => ({
  name,
  label,
  type: 'select',
  options,
  col,
});

const textField = (name: string, label: string, col = 6): Field => ({
  name,
  label,
  type: 'text',
  col,
});

const jsonField = (name: string, label: string): Field => ({
  name,
  label,
  type: 'json',
  col: 12,
});

const switchField = (name: string, label: string, col = 6): Field => ({
  name,
  label,
  type: 'switch',
  col,
});

const buildFields = (fields: Field[]): FieldGroup[] => [{ fields }];

const withDefaultActions = (config: Omit<ModelConfig, 'canDelete'>): ModelConfig => ({
  canDelete: true,
  apiProvider: conversationApi,
  ...config,
});

export const channelPageSchema: ModelConfig = withDefaultActions({
  id: 'channels',
  title: 'Channels',
  description: 'Manage delivery channels, providers, activation, and metadata.',
  endpoint: '/channels',
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'provider', label: 'Provider' },
    { key: 'externalId', label: 'External ID' },
    { key: 'isActive', label: 'Active' },
  ],
  createFieldGroups: buildFields([
    textField('name', 'Name'),
    selectField('type', 'Type', CHANNEL_TYPE_OPTIONS),
    textField('provider', 'Provider'),
    textField('externalId', 'External ID'),
    switchField('isActive', 'Active'),
    jsonField('metadata', 'Metadata'),
  ]),
  defaultState: {
    name: '',
    type: option('MOCK'),
    provider: '',
    externalId: '',
    metadata: {},
    isActive: true,
  },
  buildFormState: (row) => ({
    name: text(row.name),
    type: option(row.type),
    provider: text(row.provider),
    externalId: text(row.externalId),
    metadata: jsonObject(row.metadata),
    isActive: bool(row.isActive, true),
  }),
  buildCreatePayload: (values) => ({
    name: text(values.name).trim(),
    type: optionValue(values.type),
    provider: text(values.provider).trim() || undefined,
    externalId: text(values.externalId).trim() || undefined,
    metadata: jsonObject(values.metadata),
    isActive: bool(values.isActive, true),
  }),
  buildUpdatePayload: (values) => channelPageSchema.buildCreatePayload?.(values),
});

export const conversationPageSchema: ModelConfig = withDefaultActions({
  id: 'conversations',
  title: 'Conversations',
  description: 'Create and manage conversation sessions, participant linkage, and saved context.',
  endpoint: '/conversations',
  columns: [
    { key: 'id', label: 'Conversation ID' },
    { key: 'questionnaireId', label: 'Questionnaire' },
    { key: 'channelId', label: 'Channel' },
    { key: 'currentQuestionId', label: 'Current Question' },
    { key: 'status', label: 'Status' },
    { key: 'state', label: 'State' },
  ],
  createFieldGroups: buildFields([
    asyncField('questionnaireId', 'Questionnaire', '/questionnaires'),
    textField('questionnaireCode', 'Questionnaire Code'),
    asyncField('channelId', 'Channel', '/channels'),
    textField('participantId', 'Participant ID'),
    textField('phone', 'Phone'),
    textField('email', 'Email'),
    textField('currentQuestionId', 'Current Question ID'),
    selectField('status', 'Status', CONVERSATION_STATUS_OPTIONS),
    selectField('state', 'State', CONVERSATION_STATE_OPTIONS),
    jsonField('context', 'Context'),
  ]),
  defaultState: {
    questionnaireId: null,
    questionnaireCode: '',
    channelId: null,
    participantId: '',
    phone: '',
    email: '',
    currentQuestionId: '',
    status: option('ACTIVE'),
    state: option('START'),
    context: {},
  },
  buildFormState: (row) => ({
    questionnaireId: option(row.questionnaireId),
    questionnaireCode: '',
    channelId: option(row.channelId),
    participantId: text(row.participantId),
    phone: '',
    email: '',
    currentQuestionId: text(row.currentQuestionId),
    status: option(row.status || 'ACTIVE'),
    state: option(row.state || 'START'),
    context: jsonObject(row.context),
  }),
  buildCreatePayload: (values) => ({
    questionnaireId: optionValue(values.questionnaireId),
    questionnaireCode: text(values.questionnaireCode).trim() || undefined,
    channelId: optionValue(values.channelId),
    participantId: text(values.participantId).trim() || undefined,
    phone: text(values.phone).trim() || undefined,
    email: text(values.email).trim() || undefined,
    currentQuestionId: text(values.currentQuestionId).trim() || undefined,
    status: optionValue(values.status),
    state: optionValue(values.state),
    context: jsonObject(values.context),
  }),
  buildUpdatePayload: (values) => conversationPageSchema.buildCreatePayload?.(values),
});

export const participantPageSchema: ModelConfig = withDefaultActions({
  id: 'participants',
  title: 'Participants',
  description: 'Create participants and search by phone or email for questionnaire entry.',
  endpoint: '/participants',
  columns: [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
  ],
  createFieldGroups: buildFields([
    textField('firstName', 'First Name'),
    textField('lastName', 'Last Name'),
    textField('phone', 'Phone'),
    { ...textField('email', 'Email'), type: 'email' },
    jsonField('metadata', 'Metadata'),
  ]),
  defaultState: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    metadata: {},
  },
  buildFormState: (row) => ({
    firstName: text(row.firstName),
    lastName: text(row.lastName),
    phone: text(row.phone),
    email: text(row.email),
    metadata: jsonObject(row.metadata),
  }),
  buildCreatePayload: (values) => ({
    firstName: text(values.firstName).trim() || undefined,
    lastName: text(values.lastName).trim() || undefined,
    phone: text(values.phone).trim() || undefined,
    email: text(values.email).trim() || undefined,
    metadata: jsonObject(values.metadata),
  }),
  buildUpdatePayload: (values) => participantPageSchema.buildCreatePayload?.(values),
});

export const questionnairePageSchema: ModelConfig = withDefaultActions({
  id: 'questionnaires',
  title: 'Questionnaires',
  description:
    'Create and manage questionnaires, strategy settings, metadata, and activation state.',
  endpoint: '/questionnaires',
  columns: [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'processingStrategy', label: 'Strategy' },
    { key: 'isActive', label: 'Active' },
  ],
  createFieldGroups: buildFields([
    textField('name', 'Name'),
    textField('code', 'Code'),
    { name: 'description', label: 'Description', type: 'textarea', col: 12 },
    selectField('processingStrategy', 'Processing Strategy', PROCESSING_STRATEGY_OPTIONS),
    switchField('isActive', 'Active'),
    switchField('allowBackNavigation', 'Allow Back Navigation'),
    switchField('allowMultipleSessions', 'Allow Multiple Sessions'),
    jsonField('tags', 'Tags'),
    jsonField('metadata', 'Metadata'),
    jsonField('questions', 'Questions'),
  ]),
  defaultState: {
    name: '',
    code: '',
    description: '',
    allowBackNavigation: true,
    allowMultipleSessions: false,
    processingStrategy: option('STATIC'),
    tags: [],
    metadata: {},
    isActive: true,
    questions: [],
  },
  buildFormState: (row) => ({
    name: text(row.name),
    code: text(row.code),
    description: text(row.description),
    allowBackNavigation: bool(row.allowBackNavigation, true),
    allowMultipleSessions: bool(row.allowMultipleSessions),
    processingStrategy: option(row.processingStrategy || 'STATIC'),
    tags: jsonArray(row.tags),
    metadata: jsonObject(row.metadata),
    isActive: bool(row.isActive, true),
    questions: jsonArray(row.questions),
  }),
  buildCreatePayload: (values) => ({
    name: text(values.name).trim(),
    code: text(values.code).trim(),
    description: text(values.description).trim() || undefined,
    allowBackNavigation: bool(values.allowBackNavigation, true),
    allowMultipleSessions: bool(values.allowMultipleSessions),
    processingStrategy: optionValue(values.processingStrategy),
    metadata: jsonObject(values.metadata),
    tags: jsonArray(values.tags),
    questions: jsonArray(values.questions),
    isActive: bool(values.isActive, true),
    isDynamic: false,
    version: 1,
  }),
  buildUpdatePayload: (values) => questionnairePageSchema.buildCreatePayload?.(values),
});

export const questionPageSchema: ModelConfig = withDefaultActions({
  id: 'questions',
  title: 'Questions',
  description: 'Browse and edit questionnaire questions with schema-based fields.',
  endpoint: '/questions',
  columns: [
    { key: 'index', label: '#' },
    { key: 'attribute', label: 'Attribute' },
    { key: 'text', label: 'Text' },
    { key: 'questionType', label: 'Type' },
    { key: 'renderMode', label: 'Render' },
    { key: 'processMode', label: 'Process' },
    { key: 'isRequired', label: 'Required' },
    { key: 'isActive', label: 'Active' },
  ],
  createFieldGroups: buildFields([
    asyncField('questionnaireId', 'Questionnaire', '/questionnaires'),
    { ...textField('index', 'Index'), type: 'number' },
    textField('attribute', 'Attribute'),
    { name: 'text', label: 'Text', type: 'textarea', col: 12 },
    selectField('questionType', 'Question Type', QUESTION_TYPE_OPTIONS),
    selectField('renderMode', 'Render Mode', RENDER_MODE_OPTIONS),
    selectField('processMode', 'Process Mode', PROCESS_MODE_OPTIONS),
    switchField('isRequired', 'Required'),
    switchField('isActive', 'Active'),
    jsonField('options', 'Options'),
    jsonField('validationRules', 'Validation Rules'),
    jsonField('metadata', 'Metadata'),
  ]),
  defaultState: {
    questionnaireId: null,
    index: 1,
    attribute: '',
    text: '',
    questionType: option('text'),
    renderMode: option('input'),
    processMode: option('none'),
    isRequired: false,
    isActive: true,
    options: [],
    validationRules: [],
    metadata: {},
  },
  buildFormState: (row) => ({
    questionnaireId: option(row.questionnaireId),
    index: numberValue(row.index, 1),
    attribute: text(row.attribute),
    text: text(row.text),
    questionType: option(row.questionType || 'text'),
    renderMode: option(row.renderMode || 'input'),
    processMode: option(row.processMode || 'none'),
    isRequired: bool(row.isRequired),
    isActive: bool(row.isActive, true),
    options: jsonArray(row.options),
    validationRules: jsonArray(row.validationRules),
    metadata: jsonObject(row.metadata),
  }),
  buildCreatePayload: (values) => ({
    questionnaireId: optionValue(values.questionnaireId),
    index: numberValue(values.index, 1),
    attribute: text(values.attribute).trim(),
    text: text(values.text).trim(),
    questionType: optionValue(values.questionType),
    renderMode: optionValue(values.renderMode),
    processMode: optionValue(values.processMode),
    isRequired: bool(values.isRequired),
    isActive: bool(values.isActive, true),
    options: jsonArray(values.options),
    validationRules: jsonArray(values.validationRules),
    metadata: jsonObject(values.metadata),
  }),
  buildUpdatePayload: (values) => questionPageSchema.buildCreatePayload?.(values),
});

export const workflowPageSchema: ModelConfig = withDefaultActions({
  id: 'workflows',
  title: 'Workflows',
  description: 'Define workflow steps, transition rules, metadata, and orchestration limits.',
  endpoint: '/workflows',
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'version', label: 'Version' },
    { key: 'maxTransitionsPerRun', label: 'Max Transitions' },
    { key: 'isActive', label: 'Active' },
  ],
  createFieldGroups: buildFields([
    textField('name', 'Name'),
    textField('code', 'Code'),
    { ...textField('version', 'Version'), type: 'number' },
    { ...textField('maxTransitionsPerRun', 'Max Transitions Per Run'), type: 'number' },
    textField('startStepId', 'Start Step ID'),
    switchField('isActive', 'Active'),
    jsonField('metadata', 'Metadata'),
    jsonField('steps', 'Steps'),
  ]),
  defaultState: {
    name: '',
    code: '',
    metadata: {},
    version: 1,
    maxTransitionsPerRun: 25,
    isActive: true,
    startStepId: '',
    steps: [],
  },
  buildFormState: (row) => ({
    name: text(row.name),
    code: text(row.code),
    metadata: jsonObject(row.metadata),
    version: numberValue(row.version, 1),
    maxTransitionsPerRun: numberValue(row.maxTransitionsPerRun, 25),
    isActive: bool(row.isActive, true),
    startStepId: text(row.startStepId),
    steps: jsonArray(row.steps),
  }),
  buildCreatePayload: (values) => ({
    name: text(values.name).trim(),
    code: text(values.code).trim(),
    metadata: jsonObject(values.metadata),
    version: numberValue(values.version, 1),
    maxTransitionsPerRun: numberValue(values.maxTransitionsPerRun, 25),
    isActive: bool(values.isActive, true),
    startStepId: text(values.startStepId).trim() || undefined,
    steps: jsonArray(values.steps),
  }),
  buildUpdatePayload: (values) => workflowPageSchema.buildCreatePayload?.(values),
});

export const workflowInstancePageSchema: ModelConfig = {
  id: 'workflow-instances',
  apiProvider: conversationApi,
  title: 'Workflow Instances',
  description: 'Track active and completed workflow runs and inspect current state.',
  endpoint: '/workflow-instances',
  columns: [
    { key: 'workflowId', label: 'Workflow' },
    { key: 'workflowVersion', label: 'Version' },
    { key: 'flowId', label: 'Flow Name' },
    { key: 'status', label: 'Status' },
    { key: 'currentStepId', label: 'Current State' },
  ],
};

export const workflowEventPageSchema: ModelConfig = {
  id: 'workflow-events',
  apiProvider: conversationApi,
  title: 'Workflow Events',
  description: 'Monitor workflow events and inspect payloads for transition debugging.',
  endpoint: '/workflow-events',
  columns: [
    { key: 'workflowInstanceId', label: 'Workflow Instance' },
    { key: 'type', label: 'Type' },
    { key: 'correlationId', label: 'Correlation' },
    { key: 'sequence', label: 'Sequence' },
    {
      key: 'payload',
      label: 'Payload',
      render: (row) => JSON.stringify(row.payload ?? {}).slice(0, 80),
    },
  ],
};

export const exchangePageSchema: ModelConfig = withDefaultActions({
  id: 'exchanges',
  title: 'Exchanges',
  description:
    'Review inbound and outbound channel exchanges, message lifecycle, and payload metadata.',
  endpoint: '/exchanges',
  columns: [
    { key: 'channelType', label: 'Channel' },
    { key: 'direction', label: 'Direction' },
    { key: 'status', label: 'Status' },
    { key: 'conversationId', label: 'Conversation ID' },
    { key: 'senderId', label: 'Sender' },
    { key: 'receiverId', label: 'Receiver' },
    { key: 'messageId', label: 'Message ID' },
    { key: 'message', label: 'Message', render: (row) => (row.message as string).length < 80 ? row.message  as string : (row.message  as string)?.slice(0, 80) + '...'},
    { key: 'createdAt', label: 'CreatedAt' },
  ],
  createFieldGroups: buildFields([
    selectField('channelType', 'Channel Type', CHANNEL_TYPE_OPTIONS),
    selectField('direction', 'Direction', EXCHANGE_DIRECTION_OPTIONS),
    selectField('status', 'Status', EXCHANGE_STATUS_OPTIONS),
    textField('conversationId', 'Conversation ID'),
    textField('senderId', 'Sender ID'),
    textField('receiverId', 'Receiver ID'),
    textField('messageId', 'Message ID'),
    { name: 'message', label: 'Message', type: 'textarea', col: 12 },
    textField('questionnaireCode', 'Questionnaire Code'),
  ]),
  defaultState: {
    channelType: option('MOCK'),
    direction: option('INBOUND'),
    status: option('RECEIVED'),
    conversationId: '',
    senderId: '',
    receiverId: '',
    messageId: '',
    message: '',
    questionnaireCode: '',
  },
  buildFormState: (row) => ({
    channelType: option(row.channelType),
    direction: option(row.direction),
    status: option(row.status),
    conversationId: text(row.conversationId),
    senderId: text(row.senderId),
    receiverId: text(row.receiverId),
    messageId: text(row.messageId),
    message: text(row.message),
    questionnaireCode: text(row.questionnaireCode),
  }),
  buildCreatePayload: (values) => ({
    channelType: optionValue(values.channelType),
    direction: optionValue(values.direction),
    status: optionValue(values.status),
    conversationId: text(values.conversationId).trim() || undefined,
    senderId: text(values.senderId).trim() || undefined,
    receiverId: text(values.receiverId).trim() || undefined,
    messageId: text(values.messageId).trim(),
    message: text(values.message).trim(),
    questionnaireCode: text(values.questionnaireCode).trim() || undefined,
  }),
  buildUpdatePayload: (values) => exchangePageSchema.buildCreatePayload?.(values),
});

export const workflowAttachmentPageSchema: ModelConfig = withDefaultActions({
  id: 'workflow-attachments',
  title: 'Workflow Attachments',
  description: 'Configure questionnaire-to-workflow attachments and mapping metadata.',
  endpoint: '/workflow-attachments',
  columns: [
    { key: 'questionnaireId', label: 'Questionnaire' },
    { key: 'workflowId', label: 'Workflow' },
    { key: 'workflowVersion', label: 'Version' },
    { key: 'status', label: 'Status' },
  ],
  createFieldGroups: buildFields([
    asyncField('questionnaireId', 'Questionnaire', '/questionnaires'),
    asyncField('workflowId', 'Workflow', '/workflows'),
    { ...textField('workflowVersion', 'Workflow Version'), type: 'number' },
    selectField('status', 'Status', WORKFLOW_STATUS_OPTIONS),
    jsonField('mappings', 'Mappings'),
    jsonField('metadata', 'Metadata'),
  ]),
  defaultState: {
    questionnaireId: null,
    workflowId: null,
    workflowVersion: 1,
    status: option('ACTIVE'),
    mappings: [],
    metadata: {},
  },
  buildFormState: (row) => ({
    questionnaireId: option(row.questionnaireId),
    workflowId: option(row.workflowId),
    workflowVersion: numberValue(row.workflowVersion, 1),
    status: option(row.status || 'ACTIVE'),
    mappings: jsonArray(row.mappings),
    metadata: jsonObject(row.metadata),
  }),
  buildCreatePayload: (values) => ({
    questionnaireId: optionValue(values.questionnaireId),
    workflowId: optionValue(values.workflowId),
    workflowVersion: numberValue(values.workflowVersion, 1),
    status: optionValue(values.status),
    mappings: jsonArray(values.mappings),
    metadata: jsonObject(values.metadata),
  }),
  buildUpdatePayload: (values) => workflowAttachmentPageSchema.buildCreatePayload?.(values),
});

export const workflowStepTypeOptions = WORKFLOW_STEP_TYPE_OPTIONS;
