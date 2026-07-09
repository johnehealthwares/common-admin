import { createFileRoute } from '@tanstack/react-router';
import { IncomeStatementPage } from '@/features/rxsoft/pages/income-statement';

export const Route = createFileRoute('/_authenticated/rxsoft/reports/income-statement/')({
  component: IncomeStatementPage,
});
