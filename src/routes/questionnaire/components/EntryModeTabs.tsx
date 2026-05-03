import type { EntryMode } from '../types'

type Props = {
  value: EntryMode
  onChange: (v: EntryMode) => void
}

export function EntryModeTabs({ value, onChange }: Props) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as EntryMode)}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="participant-phone">Find by phone</TabsTrigger>
        <TabsTrigger value="conversation-id">Conversation ID</TabsTrigger>
        <TabsTrigger value="create-new">Create new</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}