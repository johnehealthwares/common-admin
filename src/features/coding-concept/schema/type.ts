// type.ts

export type ConceptAttributeValue = {
  id: string;

  concept: string;

  value: string;
  valueFormat: string;

  attribute: {
    id: string;
    code: string;
    name: string;
    dataType: string;
  };

  createdAt: string;
  updatedAt: string;
};
export type ExternalConceptMapping = {
  id: string;

  externalConcept: string;
  externalCode: string;

  internalConcept: string;
  internalCode?: string;

  conceptCodeId?: string;

  createdAt: string;
  updatedAt: string;
};
export type CodingConcept = {
  id: string;

  concept: string;
  code: string;

  name: string;
  shortName: string;
  longName: string;

  shortDescription: string;
  longDescription: string;

  conceptValues?: ConceptAttributeValue[];
  externalMappings?: ExternalConceptMapping[];

  createdAt: string;
  updatedAt: string;
};
