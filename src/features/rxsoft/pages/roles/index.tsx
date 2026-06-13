import { DataPageShell } from '../../../components/page/data-page-shell';
import { rolesConfig } from './schema';

export function RxRolesPage() {
  return <DataPageShell config={rolesConfig} />;
}
