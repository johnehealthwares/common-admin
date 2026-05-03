import { Button, Group, Input, Modal, Stack, Switch, Tabs, Text } from "@mantine/core";
import { useState } from "react";
import { FieldGroup as FieldGroupType, TabGroup } from "../../rxsoft/types";
import { Loader } from "lucide-react";
import { RenderField } from "./RenderField";
import { FieldGroup } from "./FieldGroup";
import { getColSpanClass } from "./util";

type FormProps = {
  editingRow: Record<string, unknown> | null
  showModal: boolean
  setShowModal: (value: boolean) => void
  title: string
  formState: Record<string, unknown>,
  setFormState: (value: Record<string, unknown>) => void
  modalTitle?: string
  fieldGroups: FieldGroupType[]
  tabGroups?: TabGroup[]
  mode?: 'create-then-update' | 'create-once' | 'update'
  mutation: any
  updateField: (name: string, value: unknown) => void
  renderCreateExtras?: (props: {
    formState: Record<string, unknown>
    updateField: (name: string, value: unknown) => void
  }) => any
}

export const ModalDataForm = ({
  modalTitle,
  editingRow,
  formState,
  showModal,
  setShowModal,
  title,
  mode,
  tabGroups,
  fieldGroups,
  mutation,
  updateField,
  renderCreateExtras
}
  : FormProps) => {


  const [activeTab, setActiveTab] = useState<string>(
    tabGroups?.[0]?.value ?? "default"
  )



  return <Modal
    opened={showModal}
    onClose={() => setShowModal(false)}
    title={modalTitle ? modalTitle : `Create ${title}`}
    size="lg"
    centered
    styles={{
      content: { maxHeight: '90vh', overflowY: 'auto' },
    }}
  >
    <Stack gap="lg">
      <Text size="sm" c="dimmed">
        Add a new record to the {title.toLowerCase()} module.
      </Text>

      <Tabs value={activeTab} onChange={(v) => setActiveTab(v!)}>
        <Tabs.List>
          {(tabGroups || []).map((tab, index) => (
            <Tabs.Tab
              key={tab.value}
              value={tab.value}
              disabled={mode === 'create-then-update' && index !== 0}
            >
              {tab.title}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {(tabGroups || []).map((tab) => (
          <Tabs.Panel key={tab.value} value={tab.value} pt="md">
            {tab.render
              ? tab.render({ formState, updateField })
              : (<Stack gap="xl">
                {tab.fieldGroups?.map(({ fields, title }, index) => (<FieldGroup index={index} fields={fields} title={title} formState={formState} updateField={updateField} editingRow={editingRow} />))}
              </Stack>)
            }

            {renderCreateExtras?.({
              formState,
              updateField,
            })}
          </Tabs.Panel>
        ))}
      </Tabs>
      <Stack gap="xl">
        {fieldGroups.map((group, groupIndex) => (
          <Stack key={`${group.title ?? 'group'}-${groupIndex}`} gap="sm">
            {group.title && (
              <Text size="sm" fw={500}>
                {group.title}
              </Text>
            )}


            <div className="grid gap-4 md:grid-cols-12">
              {group.fields.map((field) => (
                <div
                  key={field.name}
                  className={getColSpanClass(field.col ?? 12)}
                >
                  <Text size="sm" fw={500}>
                    {field.label}
                  </Text>
                  <RenderField
                    field={field}
                    value={String(formState[field.name] ?? field.defaultValue ?? '')}
                    updateField={updateField}
                    enabled={Boolean(editingRow) && field.editable === false}
                  />

                </div>
              ))}
            </div>
          </Stack>
        ))}

        {renderCreateExtras?.({
          formState,
          updateField,
        })}
      </Stack>

      <Group justify="flex-end">
        <Button variant="outline" onClick={() => setShowModal(false)}>
          Cancel
        </Button>

        <Button
          onClick={() => mutation.mutate(formState)}
          disabled={mutation.isPending}
          leftSection={
            mutation.isPending ? <Loader size={16} /> : null
          }
        >
          Create
        </Button>
      </Group>
    </Stack>
  </Modal>


}