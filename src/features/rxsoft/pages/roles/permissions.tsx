import {
  Box,
  Button,
  Card,
  Checkbox,
  Group,
  Loader,
  Stack,
  Text,
  Title,
  Paper,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { rxsoftApi } from '@/lib/rxsoft-api';
import { useAuthStore } from '@/stores/auth-store';

type Action = { name: string; label: string };
type Feature = { resource: string; label: string; actions: Action[] };
type ModulePerm = { id: string; name: string; features: Feature[] };

type RawPermission = { code: string; name: string; description: string; resource: string; action: string };
type RawModule = { module: string; moduleDisplayName: string; permissions: RawPermission[] };

function permCode(modId: string, _feature: Feature, action: Action): string {
  return `${modId}.${_feature.resource}.${action.name}`;
}

function toModulePerms(raw: RawModule[]): ModulePerm[] {
  return raw.map((mod) => ({
    id: mod.module,
    name: mod.moduleDisplayName,
    features: groupFeatures(mod.permissions),
  }));
}

function groupFeatures(permissions: RawPermission[]): Feature[] {
  const map = new Map<string, Feature>();
  for (const p of permissions) {
    let feature = map.get(p.resource);
    if (!feature) {
      feature = { resource: p.resource, label: p.resource.charAt(0).toUpperCase() + p.resource.slice(1), actions: [] };
      map.set(p.resource, feature);
    }
    feature.actions.push({ name: p.action, label: p.name });
  }
  return [...map.values()];
}

export function RolePermissionsPage() {
  const { id } = useParams({} as any);
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  const [modules, setModules] = useState<ModulePerm[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!accessToken) {return;}
    const fetch = async () => {
      try {
        const [permRes, roleRes] = await Promise.all([
          rxsoftApi.get<RawModule[]>('/permissions/modules'),
          rxsoftApi.get<{ permissionCodes: string[] }>(`/roles/${id}`),
        ]);
        setModules(toModulePerms(permRes.data));
        setSelected(new Set(roleRes.data.permissionCodes ?? []));
      } catch {
        notifications.show({ color: 'red', message: 'Failed to load permissions' });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [accessToken, id]);

  const togglePermission = (code: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {next.delete(code);}
      else {next.add(code);}
      return next;
    });
  };

  const toggleFeature = (modId: string, feature: Feature, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const action of feature.actions) {
        const code = permCode(modId, feature, action);
        if (checked) {next.add(code);}
        else {next.delete(code);}
      }
      return next;
    });
  };

  const toggleModule = (mod: ModulePerm, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const feature of mod.features) {
        for (const action of feature.actions) {
          const code = permCode(mod.id, feature, action);
          if (checked) {next.add(code);}
          else {next.delete(code);}
        }
      }
      return next;
    });
  };

  const isFeatureFullyChecked = (modId: string, feature: Feature) =>
    feature.actions.every((a) => selected.has(permCode(modId, feature, a)));

  const isFeaturePartiallyChecked = (modId: string, feature: Feature) =>
    feature.actions.some((a) => selected.has(permCode(modId, feature, a))) &&
    !isFeatureFullyChecked(modId, feature);

  const isModuleFullyChecked = (mod: ModulePerm) =>
    mod.features.every((f) => isFeatureFullyChecked(mod.id, f));

  const isModulePartiallyChecked = (mod: ModulePerm) =>
    mod.features.some((f) => isFeaturePartiallyChecked(mod.id, f) || isFeatureFullyChecked(mod.id, f)) &&
    !isModuleFullyChecked(mod);

  const handleSave = async () => {
    setSaving(true);
    try {
      await rxsoftApi.put(`/roles/${id}`, {
        permissionCodes: Array.from(selected),
      });
      notifications.show({ color: 'green', message: 'Permissions updated' });
      (navigate as any)({ to: '/roles' });
    } catch {
      notifications.show({ color: 'red', message: 'Failed to save permissions' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box p="xl" style={{ textAlign: 'center' }}>
        <Loader />
      </Box>
    );
  }

  return (
    <Box p="md" maw={900}>
      <Group mb="lg">
        <Button
          variant="subtle"
          leftSection={<ArrowLeft size={16} />}
          onClick={() => (navigate as any)({ to: '/roles' })}
        >
          Back to Roles
        </Button>
      </Group>

      <Title order={3} mb="xs">Role Permissions</Title>
      <Text c="dimmed" mb="lg">Select the modules and features this role can access.</Text>

      <Stack gap="md">
        {modules.map((mod) => (
          <Card key={mod.id} withBorder shadow="sm" padding="md" radius="md">
            <Checkbox
              checked={isModuleFullyChecked(mod)}
              indeterminate={isModulePartiallyChecked(mod)}
              onChange={(e) => toggleModule(mod, e.currentTarget.checked)}
              label={<Text fw={600}>{mod.name}</Text>}
              mb="sm"
            />

            <Stack gap="sm" pl="lg">
              {mod.features.map((feature) => {
                const featureChecked = isFeatureFullyChecked(mod.id, feature);
                const featureIndeterminate = isFeaturePartiallyChecked(mod.id, feature);

                return (
                  <Paper key={feature.resource} withBorder p="sm" radius="sm">
                    <Checkbox
                      checked={featureChecked}
                      indeterminate={featureIndeterminate}
                      onChange={(e) => toggleFeature(mod.id, feature, e.currentTarget.checked)}
                      label={<Text fw={500}>{feature.label}</Text>}
                      mb="xs"
                    />

                    <Group gap="lg" pl="lg">
                      {feature.actions.map((action) => {
                        const code = permCode(mod.id, feature, action);
                        return (
                          <Checkbox
                            key={code}
                            checked={selected.has(code)}
                            onChange={() => togglePermission(code)}
                            label={action.label}
                            size="sm"
                          />
                        );
                      })}
                    </Group>
                  </Paper>
                );
              })}
            </Stack>
          </Card>
        ))}
      </Stack>

      <Group mt="xl">
        <Button leftSection={<Save size={16} />} loading={saving} onClick={handleSave}>
          Save Permissions
        </Button>
      </Group>
    </Box>
  );
}
