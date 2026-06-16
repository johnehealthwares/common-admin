import { ActionIcon, Box, Button, Group, Paper, Stack, Text } from '@mantine/core';
import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PoLinesTable } from './components/PoLinesTable';
import { PoSettingsDrawer } from './components/PoSettingsDrawer';
import { PoSummary } from './components/PoSummary';
import { PoToolbar } from './components/PoToolbar';
import { usePoStore } from './store/usePoStore';
import { useCreatePurchaseOrder, useReceiveGoods, useUnpostGoods } from './api/poApi';
import { printPo } from './utils/print';
import { UnpostPasswordModal } from './components/UnpostPasswordModal';

export default function PurchasesPage() {
  const { tabs, activeTabId, setActiveTab, addTab, closeTab, resetActiveTab, resetAll, autoPrint, defaultWarehouseId, settingsOpened, setSettingsOpened } = usePoStore();

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const supplierId = activeTab?.supplierId ?? '';
  const warehouseId = activeTab?.warehouseId ?? '';
  const expectedDate = activeTab?.expectedDate ?? '';
  const note = activeTab?.note ?? '';
  const receiptNumber = activeTab?.receiptNumber ?? '';
  const receivedDate = activeTab?.receivedDate ?? '';
  const lines = activeTab?.lines ?? [];
  const pendingPoId = activeTab?.pendingPoId ?? null;

  const [unpostModal, setUnpostModal] = useState(false);
  const [unpostTargetLine, setUnpostTargetLine] = useState<string | null>(null);

  useEffect(() => {
    if (!usePoStore.getState().activeTabId && tabs.length > 0) {
      setActiveTab(tabs[0].id);
    }
  }, []);

  useEffect(() => {
    if (defaultWarehouseId && warehouseId !== defaultWarehouseId && !warehouseId) {
      usePoStore.getState().setWarehouse(defaultWarehouseId, '');
    }
  }, [defaultWarehouseId]);

  const createMutation = useCreatePurchaseOrder();
  const receiveMutation = useReceiveGoods();
  const unpostMutation = useUnpostGoods();

  async function handleSaveDraft() {
    await createMutation.mutateAsync({
      supplierId,
      warehouseId,
      expectedDate: expectedDate || undefined,
      note: note || undefined,
      status: 'draft',
      lines: lines.map((l) => ({
        itemId: l.itemId,
        orderedQty: l.orderedQty,
        uomId: l.uomId || undefined,
        unitCost: l.unitCost,
        discountPercent: l.discountPercent,
        taxPercent: l.taxPercent,
      })),
    });
    resetActiveTab();
  }

  async function handleSubmitApprove() {
    await createMutation.mutateAsync({
      supplierId,
      warehouseId,
      expectedDate: expectedDate || undefined,
      note: note || undefined,
      status: 'approved',
      lines: lines.map((l) => ({
        itemId: l.itemId,
        orderedQty: l.orderedQty,
        uomId: l.uomId || undefined,
        unitCost: l.unitCost,
        discountPercent: l.discountPercent,
        taxPercent: l.taxPercent,
      })),
    });
    resetActiveTab();
  }

  async function handlePostLine(line: any) {
    if (!pendingPoId) return;
    const payload = {
      purchaseOrderId: pendingPoId,
      receivedDate: new Date(receivedDate || new Date()).toISOString(),
      receiptNumber: receiptNumber || undefined,
      lines: [
        {
          itemId: line.itemId,
          orderedQty: line.orderedQty,
          receivedQty: line.receivedQty,
          uomId: line.uomId,
          unitCost: line.unitCost,
        },
      ],
    };
    await receiveMutation.mutateAsync({ poId: pendingPoId, payload });
    usePoStore.getState().updateLine(line.id, { isPosted: true });
    if (autoPrint) {
      printPo({
        purchaseOrderNumber: receiptNumber,
        supplierName: usePoStore.getState().tabs.find((t) => t.id === activeTabId)?.supplierName,
        warehouseName: usePoStore.getState().tabs.find((t) => t.id === activeTabId)?.warehouseName,
        orderDate: new Date().toISOString(),
        lines: [line],
        totalCost: line.lineTotal,
      });
    }
  }

  function handleUnpostLine(line: any) {
    setUnpostTargetLine(line.id);
    setUnpostModal(true);
  }

  async function handleConfirmUnpost(password: string) {
    if (!pendingPoId || !unpostTargetLine) return;
    const receiptLineId = unpostTargetLine;
    await unpostMutation.mutateAsync({
      poId: pendingPoId,
      payload: { receiptLineId, password },
    });
    usePoStore.getState().updateLine(unpostTargetLine, { isPosted: false });
    setUnpostModal(false);
    setUnpostTargetLine(null);
  }

  function handlePostAll() {
    const unposted = lines.filter((l) => !l.isDraft && !l.isPosted && l.receivedQty > 0);
    for (const line of unposted) {
      handlePostLine(line);
    }
  }

  function handlePrint() {
    printPo({
      purchaseOrderNumber: receiptNumber,
      supplierName: usePoStore.getState().tabs.find((t) => t.id === activeTabId)?.supplierName || '',
      warehouseName: usePoStore.getState().tabs.find((t) => t.id === activeTabId)?.warehouseName || '',
      orderDate: new Date().toISOString(),
      lines: lines.map((l) => ({
        itemCode: l.itemCode,
        itemName: l.itemName,
        orderedQty: l.orderedQty,
        unitCost: l.unitCost,
        lineTotal: l.lineTotal,
      })),
      totalCost: lines.reduce((s, l) => s + l.lineTotal, 0),
    });
  }

  return (
    <Box bg="#b7dce9" h="100vh">
      <Stack gap={0} h="100%">
        <Group px="md" py={4} bg="#d9edf5" gap={4}>
          {tabs.map((tab) => (
            <Group
              key={tab.id}
              gap={4}
              p="xs"
              style={{
                cursor: 'pointer',
                borderRadius: 4,
                background: tab.id === activeTabId ? '#a6d5e5' : 'transparent',
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <Text size="sm" fw={600}>{tab.label}</Text>
              <ActionIcon
                size="xs"
                variant="subtle"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              >
                <X size={12} />
              </ActionIcon>
            </Group>
          ))}
          <ActionIcon size="sm" ml={4} onClick={addTab}>
            <Plus size={14} />
          </ActionIcon>
        </Group>

        <PoToolbar
          onNew={addTab}
          onReset={resetActiveTab}
          onPrint={handlePrint}
          onSettings={() => setSettingsOpened(true)}
        />

        <Box flex={1} style={{ overflow: 'auto' }} p="md">
          {activeTab && (
            <Stack>
              <Paper withBorder>
                <PoLinesTable
                  lines={activeTab.lines}
                  onUpdateLine={(id, updates) => usePoStore.getState().updateLine(id, updates)}
                  onRemoveLine={(id) => usePoStore.getState().removeLine(id)}
                  onAddLine={() => usePoStore.getState().addLine()}
                  onPostLine={handlePostLine}
                  onUnpostLine={handleUnpostLine}
                />
                <Group p="xs">
                  <Button
                    size="xs"
                    leftSection={<Plus size={14} />}
                    onClick={() => usePoStore.getState().addLine()}
                  >
                    Add Line
                  </Button>
                </Group>
              </Paper>

              <PoSummary
                lines={activeTab.lines}
                receivedDate={activeTab.receivedDate}
                onReceivedDateChange={(d) => usePoStore.getState().setReceivedDate(d)}
                onPostAll={handlePostAll}
                onSaveDraft={handleSaveDraft}
                onSubmitApprove={handleSubmitApprove}
                saving={createMutation.isPending}
                submitting={createMutation.isPending}
              />
            </Stack>
          )}
        </Box>
      </Stack>

      <PoSettingsDrawer />

      <UnpostPasswordModal
        opened={unpostModal}
        onClose={() => { setUnpostModal(false); setUnpostTargetLine(null); }}
        onConfirm={handleConfirmUnpost}
        loading={unpostMutation.isPending}
      />
    </Box>
  );
}
