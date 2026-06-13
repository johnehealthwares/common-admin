import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
// hooks/useAttributeBootstrap.ts
import { codingConceptApi } from '@/lib/coding-concept-api';
import { useAttributeStore } from '@/stores/attributes';

export const bootstrapKeys = {
  attributeDefinitions: (moduleId: string) =>
    ['bootstrap', 'attribute-definitions', moduleId] as const,
};
export type AttributeDefinition = {
  id: string;
  code: string;
  name: string;
  dataType: string;
};

export async function fetchAttributeDefinitions(concept: string) {
  const { data } = await codingConceptApi.get<{ data: AttributeDefinition[] }>(
    `/concepts/attributes/${concept}`
  );

  return data;
}

export function useAttributeDefinitionsBootstrap(concept: string) {
  const setAttributes = useAttributeStore((s) => s.setAttributes);

  const query = useQuery({
    queryKey: bootstrapKeys.attributeDefinitions(concept),

    queryFn: () => fetchAttributeDefinitions(concept),

    staleTime: Infinity,
    gcTime: Infinity,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (query.data) {
      setAttributes(concept, query.data.data);
    }
  }, [concept, query.data, setAttributes]);

  return query;
}
