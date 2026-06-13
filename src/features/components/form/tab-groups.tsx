import { Stepper, Tabs, Tooltip } from '@mantine/core';
import { memo, useState } from 'react';
import { TabGroup } from '@/features/rxsoft/types';
import { TabPanel } from './tab-panel';

type Props = {
  tabGroups: TabGroup[];
  formState: Record<string, unknown>;
  updateField: (name: string, value: unknown) => void;
  activeTab?: string;
  onTabChange?: (value: string) => void;
};

function TabGroupsComponent({
  tabGroups,
  formState,
  updateField,
  activeTab: controlledTab,
  onTabChange,
}: Props) {
  const [internalTab, setInternalTab] = useState<string>(tabGroups?.[0]?.value ?? 'default');
  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = onTabChange ?? setInternalTab;

  return (
    <>
      <Stepper active={0}>
        {tabGroups.map((tab) => (
          <Stepper.Step key={tab.value} label={tab.title} />
        ))}
      </Stepper>
      <Tabs value={activeTab} onChange={(v) => setActiveTab(v!)}>
        <Tabs.List>
          {(tabGroups || []).map((tab, index) => (
            <Tooltip key={tab.value} label={tab.disabledToolTip || tab.description} withArrow>
              <Tabs.Tab
                value={tab.value}
                disabled={Boolean(
                  tab.waitFor &&
                  (typeof tab.waitFor === 'function'
                    ? !tab.waitFor(formState)
                    : !formState[tab.waitFor])
                )}
              >
                {tab.title}
              </Tabs.Tab>
            </Tooltip>
          ))}
        </Tabs.List>

        {(tabGroups || []).map(
          (tab) =>
            activeTab === tab.value && (
              <TabPanel key={tab.value} tab={tab} formState={formState} updateField={updateField} />
            )
        )}
      </Tabs>
    </>
  );
}

export const TabGroups = memo(TabGroupsComponent);
