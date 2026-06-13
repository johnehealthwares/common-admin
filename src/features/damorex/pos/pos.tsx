import { Box, Grid, Paper, Stack } from '@mantine/core';
import { useMemo, useState } from 'react';
import { CartTable } from './components/CartTable';
import { HeldSalesDrawer } from './components/HeldSalesDrawer';
import { PaymentModal } from './components/PaymentModal';
import { PosSettingsDrawer } from './components/PosSettingsDrawer';
import { PosToolbar } from './components/PosToolbar';
import { ProductEntryTable } from './components/ProductEntryTable';
import { SalesSummary } from './components/SalesSummary';
import { SaleTabs } from './components/SaleTabs';
import { usePosStore } from './store/usePosStore';
import type { Customer } from './types';
import { calculateTotals } from './utils/calculation';
import { useKeyboardShortcuts } from './utils/useKeyboardShortcuts';

export default function PosSalesPage() {
  const {
    sessions,
    activeSessionId,
    createSession,
    closeSession,
    setActiveSession,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    setCustomer,
    setPriceList,
    setPricingMode,
    holdSale,
    completeSale,
  } = usePosStore();

  const [paymentOpened, setPaymentOpened] = useState(false);
  const [heldSalesOpened, setHeldSalesOpened] = useState(false);
  const [settingsOpened, setSettingsOpened] = useState(false);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? sessions[0],
    [sessions, activeSessionId]
  );

  const totals = useMemo(() => {
    if (!activeSession) return { subtotal: 0, discount: 0, vat: 0, total: 0 };
    return calculateTotals(activeSession);
  }, [activeSession]);

  useKeyboardShortcuts({
    createSale: createSession,
    holdSale: () => {
      if (activeSession) holdSale(activeSession.id);
    },
    payment: () => setPaymentOpened(true),
  });

  if (!activeSession) return null;

  function handleCustomerChange(customerId: string, customerName: string) {
    setCustomer(activeSession.id, { id: customerId, name: customerName } as Customer);
  }

  function handlePriceListChange(priceListId: string, priceListName: string) {
    setPriceList(activeSession.id, priceListId, priceListName);
  }

  function handleReset() {
    clearCart(activeSession.id);
    createSession(activeSession.id);
  }

  function handleHold() {
    holdSale(activeSession.id);
    createSession();
  }

  function handlePaymentComplete() {
    completeSale(activeSession.id, totals.total, 0);
    createSession();
  }

  return (
    <>
      <Box bg="#b7dce9" h="100vh">
        <Stack gap={0} h="100%">
          {/* SALE TABS */}
          <Paper radius={0} withBorder>
            <SaleTabs
              sessions={sessions}
              activeSessionId={activeSession.id}
              onChange={setActiveSession}
              onAdd={createSession}
              onClose={closeSession}
            />
          </Paper>

          {/* TOOLBAR */}
          <PosToolbar
            session={activeSession}
            onCustomerChange={handleCustomerChange}
            onPriceListChange={handlePriceListChange}
            onPricingModeChange={(mode) => setPricingMode(activeSession.id, mode)}
            onReset={handleReset}
            onSettings={() => setSettingsOpened(true)}
          />

          {/* PRODUCT ENTRY */}
          <ProductEntryTable
            session={activeSession}
            onAddToCart={(item) => addItem(activeSession.id, item)}
          />

          {/* MAIN AREA */}
          <Grid flex={1} gap={0}>
            {/* CART */}
            <Grid.Col span={{ base: 12, md: 9 }}>
              <CartTable
                session={activeSession}
                onUpdateQty={(itemId, qty) =>
                  updateItem(activeSession.id, itemId, { quantity: qty })
                }
                onRemoveItem={(itemId) => removeItem(activeSession.id, itemId)}
              />
            </Grid.Col>

            {/* SUMMARY */}
            <Grid.Col span={{ base: 12, md: 3 }}>
              <SalesSummary
                itemCount={activeSession.cart.length}
                totals={totals}
                onCheckout={() => setPaymentOpened(true)}
                onHold={handleHold}
                onNextCustomer={handleReset}
                paidAmount={activeSession.paidAmount}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Box>

      {/* PAYMENT */}
      <PaymentModal
        opened={paymentOpened}
        onClose={() => setPaymentOpened(false)}
        session={activeSession}
        totals={totals}
        onComplete={handlePaymentComplete}
      />

      {/* HELD SALES */}
      <HeldSalesDrawer
        opened={heldSalesOpened}
        onClose={() => setHeldSalesOpened(false)}
        onResume={(id) => setActiveSession(id)}
      />

      {/* SETTINGS */}
      <PosSettingsDrawer opened={settingsOpened} onClose={() => setSettingsOpened(false)} />
    </>
  );
}
