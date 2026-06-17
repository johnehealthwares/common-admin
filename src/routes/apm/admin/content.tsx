import { createFileRoute } from '@tanstack/react-router';
import { ContentFactoryPage } from '@/features/apm/admin/ContentFactoryPage';

export const Route = createFileRoute('/apm/admin/content')({
  component: ContentFactoryPage,
});
