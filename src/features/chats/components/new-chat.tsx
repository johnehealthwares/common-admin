import { useState } from 'react'
import { Check, X, Search } from 'lucide-react'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Badge, Button, Modal, TextInput, ScrollArea, Group, Stack, Text, Avatar, UnstyledButton } from '@mantine/core'
import { type ChatUser } from '../data/chat-types'

type User = Omit<ChatUser, 'messages'>

type NewChatProps = {
  users: User[]
  open: boolean
  onOpenChange: (open: boolean) => void
}
export function NewChat({ users, onOpenChange, open }: NewChatProps) {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])

  const handleSelectUser = (user: User) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user])
    } else {
      handleRemoveUser(user.id)
    }
  }

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId))
  }

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
    // Reset selected users when dialog closes
    if (!newOpen) {
      setSelectedUsers([])
    }
  }

  return (
    <Modal opened={open} onClose={() => handleOpenChange(false)} title='New message' size='lg'>
      <Stack gap='md'>
        <Group gap='xs' align='center'>
          <Text size='sm' c='dimmed'>To:</Text>
          <Group gap={6}>
            {selectedUsers.map((user) => (
              <Badge key={user.id} variant='light' rightSection={
                <X
                  size={12}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRemoveUser(user.id)}
                />
              }>
                {user.fullName}
              </Badge>
            ))}
          </Group>
        </Group>

        <TextInput
          placeholder='Search people...'
          leftSection={<Search size={16} />}
        />

        <ScrollArea h={300} type='auto'>
          <Stack gap={4}>
            {users.map((user) => {
              const isSelected = selectedUsers.some((u) => u.id === user.id)
              return (
                <UnstyledButton
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  p='xs'
                  style={{
                    borderRadius: '4px',
                    backgroundColor: isSelected ? 'var(--mantine-color-blue-light)' : 'transparent'
                  }}
                >
                  <Group justify='space-between'>
                    <Group>
                      <Avatar src={user.profile} size='sm' radius='xl' />
                      <div>
                        <Text size='sm' fw={500}>{user.fullName}</Text>
                        <Text size='xs' c='dimmed'>{user.username}</Text>
                      </div>
                    </Group>
                    {isSelected && <Check size={16} color='var(--mantine-color-blue-filled)' />}
                  </Group>
                </UnstyledButton>
              )
            })}
          </Stack>
        </ScrollArea>

        <Button
          fullWidth
          onClick={() => showSubmittedData(selectedUsers)}
          disabled={selectedUsers.length === 0}
        >
          Chat
        </Button>
      </Stack>
    </Modal>
  )
}
