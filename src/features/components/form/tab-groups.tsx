import { Button, Group, Stepper } from '@mantine/core';
import { memo, useState } from 'react';
import { TabGroup } from '@/features/rxsoft/types';
import { TabPanel } from './tab-panel';

type Props = {
  tabGroups: TabGroup[];
  formState: Record<string, unknown>;
  updateField: (name: string, value: unknown) => void;
  onSubmit?: () => void;
  isPending?: boolean;
};

function TabGroupsComponent({
  tabGroups,
  formState,
  updateField,
  onSubmit,
  isPending,
}: Props) {
  const [activeStep, setActiveStep] = useState(0);

  const isStepDisabled = (stepIndex: number) => {
    const tab = tabGroups[stepIndex];
    if (!tab?.waitFor) return false;
    return typeof tab.waitFor === 'function'
      ? !tab.waitFor(formState)
      : !formState[tab.waitFor];
  };

  const currentTab = tabGroups[activeStep];

  return (
    <>
      <Stepper active={activeStep} onStepClick={setActiveStep} allowNextStepsSelect={false}>
        {tabGroups.map((tab, i) => (
          <Stepper.Step
            key={tab.value}
            label={tab.title}
            disabled={isStepDisabled(i)}
            onClick={() => {
              if (!isStepDisabled(i)) {
                setActiveStep(i);
              }
            }}
          >
            <TabPanel tab={tab} formState={formState} updateField={updateField} />
          </Stepper.Step>
        ))}
      </Stepper>

      <Group justify="flex-end" mt="xl">
        <Button variant="outline" onClick={() => setActiveStep((s) => Math.max(0, s - 1))} disabled={activeStep === 0}>
          Previous
        </Button>
        {activeStep < tabGroups.length - 1 ? (
          <Button onClick={() => setActiveStep((s) => s + 1)} disabled={isStepDisabled(activeStep + 1)}>
            Next
          </Button>
        ) : (
          onSubmit && (
            <Button onClick={onSubmit} disabled={isPending} loading={isPending}>
              {isPending ? 'Submitting...' : 'Submit'}
            </Button>
          )
        )}
      </Group>
    </>
  );
}

export const TabGroups = memo(TabGroupsComponent);
