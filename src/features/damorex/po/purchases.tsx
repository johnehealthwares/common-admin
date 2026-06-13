import { Box, Grid, Group, Paper, Stack, Tabs, Text } from '@mantine/core';
import { useState } from 'react';
import { InflowList } from './components/InflowList';
import { PoForm } from './components/PoForm';

export default function PurchasesPage() {
  return (
    <Box bg="#b7dce9" h="100vh">
      <Stack gap={0} h="100%">
        <Paper radius={0} withBorder>
          <Tabs defaultValue="po">
            <Tabs.List>
              <Tabs.Tab value="po">Purchase Order</Tabs.Tab>
              <Tabs.Tab value="inflow">Goods Receipt / Inflow</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Paper>

        <Box flex={1} style={{ overflow: 'auto' }}>
          <Tabs defaultValue="po">
            <Tabs.Panel value="po">
              <PoForm />
            </Tabs.Panel>
            <Tabs.Panel value="inflow">
              <InflowList />
            </Tabs.Panel>
          </Tabs>
        </Box>
      </Stack>
    </Box>
  );
}
