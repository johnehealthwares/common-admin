/**
 * Example: Module Context Usage Components
 *
 * This file demonstrates various ways to use the ModuleContext hooks
 * Copy and adapt these patterns for your own components
 */

import { Button, Select, Card, Text, Badge, Group, Stack } from '@mantine/core';
import { useState } from 'react';
import {
  useModuleContext,
  useModuleId,
  useApiProvider,
  useModuleName,
  useModuleDefinition,
  useSetSelectedModule,
  useAvailableModules,
} from '@/context/module-context';

/**
 * Example 1: Simple module info display
 */
export function ModuleInfoCard() {
  const { moduleName, moduleDescription, moduleRoot } = useModuleContext();

  return (
    <Card shadow="sm" padding="lg" radius="md">
      <Stack gap="sm">
        <Text fw={500} size="lg">
          {moduleName}
        </Text>
        <Text size="sm" c="dimmed">
          {moduleDescription}
        </Text>
        <Badge>{moduleRoot}</Badge>
      </Stack>
    </Card>
  );
}

/**
 * Example 2: Module switcher dropdown
 */
export function ModuleSwitcherDropdown() {
  const currentModuleId = useModuleId();
  const setSelectedModule = useSetSelectedModule();
  const availableModules = useAvailableModules();

  const options = availableModules.map((module) => ({
    value: module.id,
    label: module.title,
  }));

  return (
    <Select
      label="Select Module"
      placeholder="Choose a module"
      value={currentModuleId}
      onChange={(value) => value && setSelectedModule(value as any)}
      data={options}
      searchable
      clearable={false}
    />
  );
}

/**
 * Example 3: Module grid switcher with buttons
 */
export function ModuleGridSwitcher() {
  const currentModuleId = useModuleId();
  const setSelectedModule = useSetSelectedModule();
  const availableModules = useAvailableModules();

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}
    >
      {availableModules.map((module) => (
        <Button
          key={module.id}
          onClick={() => setSelectedModule(module.id)}
          variant={currentModuleId === module.id ? 'filled' : 'default'}
          title={module.description}
          fullWidth
        >
          {module.title}
        </Button>
      ))}
    </div>
  );
}

/**
 * Example 4: Current module status display
 */
export function ModuleStatus() {
  const moduleId = useModuleId();
  const moduleName = useModuleName();
  const moduleDefinition = useModuleDefinition();

  return (
    <Group>
      <div>
        <Text size="sm" c="dimmed">
          Current Module
        </Text>
        <Text fw={500}>{moduleName}</Text>
      </div>
      <Badge color="blue">{moduleId}</Badge>
      <Badge color="gray">{moduleDefinition.root}</Badge>
    </Group>
  );
}

/**
 * Example 5: Module-aware API calls
 */
export function ModuleDataFetcher() {
  const apiProvider = useApiProvider();
  const moduleName = useModuleName();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // This example assumes an endpoint, adjust to your actual API
      const response = await apiProvider.get('/api/data');
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md">
      <Stack gap="sm">
        <Text fw={500}>Fetching data from {moduleName}</Text>
        <Button onClick={fetchData} loading={loading}>
          Fetch Data
        </Button>
        {error && (
          <Text color="red" size="sm">
            Error: {error}
          </Text>
        )}
        {data && (
          <Text size="sm">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </Text>
        )}
      </Stack>
    </Card>
  );
}

/**
 * Example 6: Complete context view
 */
export function CompleteModuleContextDisplay() {
  const context = useModuleContext();

  return (
    <Card shadow="sm" padding="lg" radius="md">
      <Stack gap="md">
        <Text fw={500} size="lg">
          Complete Module Context
        </Text>

        <div>
          <Text fw={500} size="sm">
            Module Information
          </Text>
          <Text size="sm">ID: {context.moduleId}</Text>
          <Text size="sm">Name: {context.moduleName}</Text>
          <Text size="sm">Root: {context.moduleRoot}</Text>
          <Text size="sm">Description: {context.moduleDescription}</Text>
        </div>

        <div>
          <Text fw={500} size="sm">
            Available Modules
          </Text>
          <Stack gap="xs">
            {context.modules.map((module) => (
              <Group key={module.id} justify="space-between">
                <div>
                  <Text size="sm" fw={module.id === context.moduleId ? 500 : 400}>
                    {module.title}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {module.id}
                  </Text>
                </div>
                {module.id === context.moduleId && <Badge>Current</Badge>}
              </Group>
            ))}
          </Stack>
        </div>

        <Button onClick={() => context.setSelectedModule('lis')}>Switch to LIS Module</Button>
      </Stack>
    </Card>
  );
}

/**
 * Example 7: Conditional rendering based on module
 */
export function ConditionalModuleContent() {
  const moduleId = useModuleId();

  return (
    <div>
      {moduleId === 'lis' && (
        <Card bg="blue.0" padding="lg">
          <Text>This content is specific to the LIS module</Text>
        </Card>
      )}

      {moduleId === 'conversation' && (
        <Card bg="green.0" padding="lg">
          <Text>This content is specific to the Conversation module</Text>
        </Card>
      )}

      {moduleId === 'rxsoft' && (
        <Card bg="purple.0" padding="lg">
          <Text>This content is specific to the RxSoft module</Text>
        </Card>
      )}

      {!['lis', 'conversation', 'rxsoft'].includes(moduleId) && (
        <Card bg="gray.0" padding="lg">
          <Text>This content appears for other modules</Text>
        </Card>
      )}
    </div>
  );
}
