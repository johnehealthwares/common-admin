import { FormProvider } from '@/features/components/form/form-context';
import { DataPageShell } from '../../../components/page/data-page-shell';
import { uomCategoryConfig } from './schema';

export function RxUomCategoryPage() {
  return (
    <FormProvider initialState={{}}>
      <DataPageShell config={uomCategoryConfig} />
    </FormProvider>
  );
}

export { RxUomEditPage } from './create';
