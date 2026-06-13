import { HDIdentifier } from './ae.model';
import { RouteStatus, MessageType, ProtocolType } from './enums';

export type RouteCondition = {
  field: string;
  operator:
    | 'equals'
    | 'contains'
    | 'startsWith'
    | 'endsWith'
    | 'regex'
    | 'in'
    | 'between'
    | 'gt'
    | 'lt'
    | 'gte'
    | 'lte';
  value: any;
  jsonPath?: string;
};

export type RoutingRule = {
  id: string;
  name: string;
  description?: string;
  priority: number;
  sourceAE: string;
  targetAE: string;
  applicationId?: string;
  applicationName?: string;
  applicationIdentifier?: HDIdentifier;
  messageType: MessageType;
  protocol?: ProtocolType;
  conditions: RouteCondition[];
  mappingId?: string;
  validationIds?: string[];
  validationConfig?: {
    enabled?: boolean;
    useCodingServer?: boolean;
    metadata?: boolean;
    mode?: 'search' | 'match';
  };
  enabled: boolean;
  status: RouteStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type RoutingTable = {
  id: string;
  name: string;
  description?: string;
  routes: RoutingRule[];
  defaultRoute?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RouteEvaluationContext = {
  message: any;
  sourceAE: string;
  targetAE?: string;
  metadata?: Record<string, any>;
};

export type RouteEvaluationResult = {
  matched: boolean;
  route?: RoutingRule;
  targetAE: string;
  applicationId?: string;
  applicationName?: string;
  mappingId?: string;
  metadata?: Record<string, any>;
};

export type RoutingFormState = {
  id?: string;
  name: string;
  description: string;
  priority: number;
  sourceAE: string;
  targetAE: string;
  applicationId?: string;
  applicationName?: string;
  applicationIdentifier?: HDIdentifier;
  messageType: MessageType;
  protocol?: ProtocolType;
  conditions: RouteCondition[];
  mappingId?: string;
  validationIds?: string[];
  validationConfig?: {
    enabled?: boolean;
    useCodingServer?: boolean;
    metadata?: boolean;
    mode?: 'search' | 'match';
  };
  enabled: boolean;
  status: RouteStatus;
};

export const defaultRoutingFormState: RoutingFormState = {
  name: '',
  description: '',
  priority: 1,
  sourceAE: '',
  targetAE: '',
  messageType: MessageType.ORDER,
  conditions: [],
  enabled: true,
  status: RouteStatus.ACTIVE,
};
