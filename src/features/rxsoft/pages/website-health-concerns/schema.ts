import type { ModelConfig } from '../../../shared/model-schema';
import type { Column, Field } from '../../types';

const columns: Column[] = [
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'displayOrder', label: 'Order' },
  { key: 'isActive', label: 'Active' },
  { key: 'description', label: 'Description' },
];

const createFields: Field[] = [
  { name: 'name', label: 'Name', required: true, col: 6 },
  { name: 'slug', label: 'Slug', required: true, col: 6, placeholder: 'e.g. malaria' },
  { name: 'description', label: 'Description', col: 12 },
  { name: 'content', label: 'Content (HTML)', type: 'textarea', col: 12 },
  { name: 'iconName', label: 'Icon Name', col: 6 },
  { name: 'displayOrder', label: 'Display Order', type: 'number', col: 3 },
  { name: 'isActive', label: 'Active', type: 'switch', col: 3 },
  { name: 'imageUrl', label: 'Image URL', col: 12 },
  { name: 'metaTitle', label: 'Meta Title', col: 6 },
  { name: 'metaDescription', label: 'Meta Description', col: 6 },
];

function buildCreatePayload(values: Record<string, unknown>) {
  return {
    name: values.name,
    slug: values.slug,
    description: values.description || undefined,
    content: values.content || undefined,
    iconName: values.iconName || undefined,
    displayOrder: values.displayOrder ? Number(values.displayOrder) : 0,
    isActive: values.isActive ?? true,
    imageUrl: values.imageUrl || undefined,
    metaTitle: values.metaTitle || undefined,
    metaDescription: values.metaDescription || undefined,
  };
}

export const healthConcernsConfig: ModelConfig = {
  id: 'website-health-concerns',
  title: 'Health Concerns',
  description: 'Manage health concerns for the Damorex website.',
  endpoint: '/website/admin/health-concerns',
  columns,
  createFields,
  buildCreatePayload,
  canDelete: true,
};
