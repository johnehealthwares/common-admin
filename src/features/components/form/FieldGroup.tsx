import { Stack, Text } from "@mantine/core"
import { RenderField } from "./RenderField"
import { Field } from "@/features/rxsoft/types"
import { getColSpanClass } from "./util"

type Props = {
    title?: string
    fields: Field[]
    index: number
    formState: Record<string, unknown>
    updateField: (name: string, value: unknown) => void
    editingRow: Record<string, unknown> | null
}
export const FieldGroup = ({ title, fields, index, formState, updateField, editingRow }: Props) => {

   
    return (
        <Stack key={`${title ?? "group"}-${index}`} gap="sm">
            {title && (
                <Text size="sm" fw={500}>
                    {title}
                </Text>
            )}

            <div className="grid gap-4 md:grid-cols-12">
                {fields.map((field: Field) => (
                    <div
                        key={field.name}
                        className={getColSpanClass(field.col ?? 12)}
                    >
                        <Text size="sm" fw={500}>
                            {field.label}
                        </Text>
                        <RenderField
                            field={field}
                            value={String(
                                formState[field.name] ??
                                field.defaultValue ??
                                ""
                            )}
                            updateField={updateField}
                            enabled={Boolean(editingRow) && field.editable === false}
                        />
                    </div>
                ))}
            </div>
        </Stack>
    )
}


