import { ProtocolType, MessageType } from './enums';

export type MappingStep = {
  id: string;
  name: string;
  description?: string;
  type: 'field-map' | 'transform' | 'conditional' | 'aggregate' | 'lookup' | 'custom-js';
  sourceField: string;
  targetField: string;
  transformation?: string | MappingTransformation;
  condition?: string;
  fallbackValue?: any;
  required?: boolean;
};

export type MappingTransformation = {
  type:
    | 'uppercase'
    | 'lowercase'
    | 'dateFormat'
    | 'concat'
    | 'split'
    | 'slice'
    | 'replace'
    | 'regex'
    | 'custom'
    | 'lookup'
    | 'calculate';
  params?: Record<string, any>;
  expression?: string;
};

export type LookupConfig = {
  source: 'database' | 'cache' | 'api' | 'file';
  query?: string;
  endpoint?: string;
  cacheExpiry?: number;
  defaultValue?: any;
};

export type StandardMapping = {
  id: string;
  name: string;
  description?: string;
  sourceProtocol: ProtocolType;
  targetProtocol: ProtocolType;
  sourceMessageType: MessageType;
  targetMessageType: MessageType;
  mappingSteps: MappingStep[];
  globalLookups?: Record<string, LookupConfig>;
  version: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type MappingContext = {
  sourceMessage: any;
  targetMessage?: any;
  variables?: Record<string, any>;
  lookupCache?: Map<string, any>;
};

export type MappingResult = {
  success: boolean;
  targetMessage?: any;
  errors?: string[];
  metadata?: Record<string, any>;
  executionTime?: number;
};

export type MappingEngine = {
  mapMessage(
    message: any,
    mapping: StandardMapping,
    context?: MappingContext
  ): Promise<MappingResult>;
};
