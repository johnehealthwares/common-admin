import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { codingConceptView } from '@/features/coding-concept/schema/view';
import { GenericViewComponent } from '@/features/components/view';
import { useEnhancedCodingConceptView } from '@/features/components/view/ehannced-view';
import { getModelConfig } from '@/features/registry';
import type { View } from '@/features/rxsoft/types';
import type { ModelConfig } from '@/features/shared/model-schema';
import { modules } from '@/features/shared/module-data';

export const Route = createFileRoute('/_authenticated/$page/$id')({
  component: GenericViewPage,
});

function findModuleForResource(page: string) {
  return modules.find((m) => m.resources.includes(page));
}

function GenericViewPage() {
  const { page, id } = Route.useParams();
  const [modelConfig, setModelConfig] = useState<ModelConfig | null>(null);

  useEffect(() => {
    getModelConfig(page).then(setModelConfig);
  }, [page]);

  const view = modelConfig?.view;
  const apiProvider = modelConfig?.apiProvider ?? findModuleForResource(page)?.apiProvider;

  const detailQuery = useQuery({
    queryKey: [page, id],
    enabled: !!view && !!apiProvider,
    queryFn: async () => {
      const endpoint = view!.endpoint.replace(':id', id);
      return apiProvider!.get(endpoint);
    },
  });

  const data = detailQuery.data?.data?.data ?? detailQuery.data?.data;

  if (!view) {
    if (page === 'coding-concepts') {
      return <CodingConceptDetailView id={id} />;
    }
    return <div>Invalid page configuration</div>;
  }

  if (detailQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return <GenericViewComponent view={view as View<any>} data={data} />;
}

function CodingConceptDetailView({ id }: { id: string }) {
  const view = useEnhancedCodingConceptView(codingConceptView, 'LOINC');
  const detailQuery = useQuery({
    queryKey: ['coding-concepts', id],
    enabled: true,
    queryFn: async () => {
      const { codingConceptApi } = await import('@/lib/coding-concept-api');
      return codingConceptApi.get(view!.endpoint.replace(':id', id));
    },
  });

  const data = detailQuery.data?.data?.data;

  if (!data) return <div>Loading...</div>;

  return <GenericViewComponent view={view as View<any>} data={data} />;
}

export default GenericViewPage;
