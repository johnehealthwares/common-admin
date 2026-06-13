import type { ModelConfig } from '@/features/shared/model-schema';
import type { View, ViewField, ViewFieldGroup, Column, Field, FieldGroup } from '@/features/rxsoft/types';

const HIDDEN_FIELD_TYPES = new Set(['hidden', 'password']);

function fieldToViewField(f: Field): ViewField<any> {
  return { key: f.name, label: f.label, col: f.col ?? 3 };
}

function columnToViewField(c: Column): ViewField<any> | null {
  if (c.render) return null;
  if (c.key.includes('.')) {
    return {
      key: c.key,
      label: c.label,
      col: 3,
      render: (_: any, data: any) => {
        const value = c.key.split('.').reduce((acc: any, k: string) => acc?.[k], data);
        return String(value ?? '-');
      },
    };
  }
  return { key: c.key, label: c.label, col: 3 };
}

function fieldGroupToViewFieldGroup(fg: FieldGroup): ViewFieldGroup<any> {
  return {
    title: fg.title,
    fields: fg.fields
      .filter((f) => !HIDDEN_FIELD_TYPES.has(f.type ?? ''))
      .map(fieldToViewField),
  };
}

function deriveEndpoint(endpoint: string): string {
  if (endpoint.includes(':id')) return endpoint;
  return `${endpoint.replace(/\/$/, '')}/:id`;
}

export function deriveView(config: ModelConfig): View<any> {
  if (config.view) return config.view;

  const endpoint = deriveEndpoint(config.endpoint);
  const title = `${config.title} Details`;

  let fieldGroups: ViewFieldGroup<any>[] = [];

  if (config.tabGroups?.length) {
    fieldGroups = config.tabGroups.flatMap((tab) =>
      (tab.fieldGroups ?? []).map(fieldGroupToViewFieldGroup),
    );
  }

  if (!fieldGroups.length && config.createFieldGroups?.length) {
    fieldGroups = config.createFieldGroups.map(fieldGroupToViewFieldGroup);
  }

  if (!fieldGroups.length && config.createFields?.length) {
    const fields = config.createFields
      .filter((f) => !HIDDEN_FIELD_TYPES.has(f.type ?? ''))
      .map(fieldToViewField);
    if (fields.length) {
      fieldGroups = [{ title: 'Details', fields }];
    }
  }

  if (!fieldGroups.length && config.columns?.length) {
    const fields = config.columns
      .map(columnToViewField)
      .filter((f): f is ViewField<any> => f !== null);
    if (fields.length) {
      fieldGroups = [{ title: 'Details', fields }];
    }
  }

  return { endpoint, title, fieldGroups };
}
