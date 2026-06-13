import { ProtocolType, AEStatus, MessageType } from './enums';

export type SecuritySettings = {
  tlsEnabled: boolean;
  tlsVersion?: string;
  certificatePath?: string;
  privateKeyPath?: string;
  caPath?: string;
  acceptSelfSigned?: boolean;
};

export type EAVAttribute = {
  name: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json' | 'date';
  required?: boolean;
};

export type ProtocolConfig = {
  protocol: ProtocolType;
  host: string;
  port: number;
  timeout?: number;
  retryCount?: number;
  retryDelayMs?: number;
  codec?: string;
  hl7Config?: {
    version?: string;
    segmentTerminator?: string;
    fieldSeparator?: string;
    componentSeparator?: string;
    repetitionSeparator?: string;
    escapeCharacter?: string;
  };
  fhirConfig?: {
    version?: string;
    resourceTypes?: string[];
  };
  httpConfig?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    authentication?: 'basic' | 'bearer' | 'oauth2' | 'none';
    authToken?: string;
  };
};

export type AEMappingBinding = {
  messageType: MessageType;
  protocol: ProtocolType;
  mappingId?: string;
};

export type MappingReference = {
  inboundMappingId?: string;
  outboundMappingId?: string;
  inbound?: AEMappingBinding[];
  outbound?: AEMappingBinding[];
};

export type HDIdentifier = {
  namespaceId?: string;
  id?: string;
  idType?: string;
};

export type AEFacilityProfile = {
  facilityId?: string;
  facilityName?: string;
  customId?: string;
  identifier?: HDIdentifier;
};

/** Application Entity (AE) Contract */
export type ApplicationEntityContract = {
  id: string;
  name: string;
  description?: string;
  facilityCode?: string;
  facilityId?: string;
  facilityName?: string;
  customId?: string;
  facilityIdentifier?: HDIdentifier;
  facility?: AEFacilityProfile;
  organizationId?: string;
  status: AEStatus;
  inboundCapabilities: ProtocolType[];
  outboundCapabilities: ProtocolType[];
  inboundConfig: ProtocolConfig[];
  outboundConfig: ProtocolConfig[];
  mappings: MappingReference;
  securitySettings: SecuritySettings;
  attributes?: Record<string, EAVAttribute>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

/** AE List Filter Options */
export type AEListFilter = {
  status?: AEStatus;
  protocol?: ProtocolType;
  facilityCode?: string;
  organizationId?: string;
  search?: string;
  skip?: number;
  take?: number;
};

/** AE Creation Payload */
export type AECreatePayload = Omit<
  ApplicationEntityContract,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

/** AE Update Payload */
export type AEUpdatePayload = Partial<
  Omit<ApplicationEntityContract, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
>;

/** AE Response with metadata */
export type AEResponse = {
  data: ApplicationEntityContract;
  message?: string;
};

/** AE List Response */
export type AEListResponse = {
  data: ApplicationEntityContract[];
  total: number;
  skip: number;
  take: number;
};
