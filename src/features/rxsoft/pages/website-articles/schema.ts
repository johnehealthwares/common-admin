import type { ModelConfig } from '../../../shared/model-schema';
import type { Column, Field } from '../../types';

const columns: Column[] = [
  { key: 'title', label: 'Title' },
  { key: 'slug', label: 'Slug' },
  { key: 'category', label: 'Category' },
  { key: 'authorName', label: 'Author' },
  { key: 'isPublished', label: 'Published' },
  { key: 'readingTime', label: 'Reading Time' },
];

const createFields: Field[] = [
  { name: 'title', label: 'Title', required: true, col: 6 },
  { name: 'slug', label: 'Slug', required: true, col: 6, placeholder: 'e.g. healthy-living' },
  { name: 'category', label: 'Category', col: 6 },
  { name: 'authorName', label: 'Author Name', col: 6 },
  { name: 'excerpt', label: 'Excerpt', type: 'textarea', col: 12 },
  { name: 'content', label: 'Content (HTML)', type: 'textarea', col: 12 },
  { name: 'readingTime', label: 'Reading Time (min)', type: 'number', col: 3 },
  { name: 'isPublished', label: 'Published', type: 'switch', col: 3 },
  { name: 'imageUrl', label: 'Image URL', col: 12 },
];

function buildCreatePayload(values: Record<string, unknown>) {
  return {
    title: values.title,
    slug: values.slug,
    category: values.category || undefined,
    authorName: values.authorName || undefined,
    excerpt: values.excerpt || undefined,
    content: values.content || undefined,
    readingTime: values.readingTime ? Number(values.readingTime) : undefined,
    isPublished: values.isPublished ?? false,
    imageUrl: values.imageUrl || undefined,
  };
}

export const articlesConfig: ModelConfig = {
  id: 'website-articles',
  title: 'Blog Articles',
  description: 'Manage blog articles for the Damorex website.',
  endpoint: '/website/admin/articles',
  columns,
  createFields,
  buildCreatePayload,
  canDelete: true,
};
