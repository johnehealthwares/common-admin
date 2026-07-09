import { createFileRoute } from '@tanstack/react-router';
import { BalanceSheetPage } from '@/features/rxsoft/pages/balance-sheet';

export const Route = createFileRoute('/_authenticated/rxsoft/reports/balance-sheet/')({
  component: BalanceSheetPage,
});
