import { Stack, Text } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import { RxPage } from '@/features/components/page/rx-page';
import { LisResourcePage } from '@/features/lis/pages';
import { getLisResourceByKey } from '@/features/lis/schema/resources';

export const Route = createFileRoute('/_authenticated/lis/$resourceKey')({
  component: RouteComponent,
});

function RouteComponent() {
  const { resourceKey } = Route.useParams();
  const resource = getLisResourceByKey(resourceKey);
  if (!resource) {
    return null;
  }
  return (
    <RxPage
      title="Laboratory Information System"
      description="Manage LIS test catalogs, sample handling, locations, priorities and reference ranges."
    >
      <Stack gap="md">
        <Text c="dimmed">
          Choose a LIS resource to manage, then open it in its own dedicated page.
        </Text>

        <LisResourcePage resource={resource} />
      </Stack>
    </RxPage>
  );
}
