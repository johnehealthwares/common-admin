import { createFileRoute } from '@tanstack/react-router';
import { ServiceUnavailableError } from '@/features/errors/service-unavailable-error';

export const Route = createFileRoute('/(errors)/service-unavailable')({
  validateSearch: (search: Record<string, unknown>) => ({
    return: search.return as string | undefined,
    url: search.url as string | undefined,
  }),
  component: ServiceUnavailableError,
});
