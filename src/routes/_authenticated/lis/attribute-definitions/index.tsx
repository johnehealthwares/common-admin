import { createFileRoute } from '@tanstack/react-router';
import { LisAttributeDefinitionsPage } from '@/features/lis/pages';

export const Route = createFileRoute('/_authenticated/lis/attribute-definitions/')({
  component: LisAttributeDefinitionsPage,
});
