export type ProtocolConfig = {
  protocol: string;
  host: string;
  port: number;
  timeout?: number;
  retryCount?: number;
  retryDelayMs?: number;
  codec?: string;
  hl7Config?: Record<string, any>;
  fhirConfig?: Record<string, any>;
  httpConfig?: Record<string, any>;
};

export type SecuritySettings = {
  tlsEnabled: boolean;
  tlsVersion?: string;
  certificatePath?: string;
  privateKeyPath?: string;
  caPath?: string;
  acceptSelfSigned?: boolean;
};

export type AEFormState = {
  id?: string;
  name: string;
  description: string;
  facilityCode: string;
  facilityId: string;
  facilityName: string;
  customId: string;
  organizationId: string;
  status: string;
  inboundCapabilities: string[];
  outboundCapabilities: string[];
  inboundConfig: ProtocolConfig[];
  outboundConfig: ProtocolConfig[];
  securitySettings: SecuritySettings;
  attributes?: Record<string, unknown>;
};

export const defaultSecuritySettings: SecuritySettings = {
  tlsEnabled: true,
  tlsVersion: 'TLSv1.3',
  acceptSelfSigned: false,
};

export const defaultFormState: AEFormState = {
  name: '',
  description: '',
  facilityCode: '',
  facilityId: '',
  facilityName: '',
  customId: '',
  organizationId: '',
  status: 'ACTIVE',
  inboundCapabilities: [],
  outboundCapabilities: [],
  inboundConfig: [],
  outboundConfig: [],
  securitySettings: defaultSecuritySettings,
};
