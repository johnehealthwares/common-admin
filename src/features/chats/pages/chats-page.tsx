import { useState, Fragment } from 'react'
import {
  ArrowLeft,
  MoreVertical,
  Edit,
  Paperclip,
  Phone,
  ImagePlus,
  Plus,
  Search as SearchIcon,
  Send,
  Video,
  MessagesSquare,
} from 'lucide-react'

import {
  AppShell,
  Avatar,
  Button,
  Group,
  ScrollArea,
  Text,
  TextInput,
  ActionIcon,
  Divider,
  Paper,
  Stack,
} from '@mantine/core'

import { NewChat } from '../components/new-chat'
import { type ChatUser, type Convo } from '../data/chat-types'
import { conversations } from '../data/convo.json'
import dayjs from 'dayjs'

export function Chats() {
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [mobileSelectedUser, setMobileSelectedUser] = useState<ChatUser | null>(null)
  const [createConversationDialogOpened, setCreateConversationDialog] = useState(false)

  const filteredChatList = conversations.filter(({ fullName }) =>
    fullName.toLowerCase().includes(search.trim().toLowerCase())
  )

  const currentMessage = selectedUser?.messages.reduce(
    (acc: Record<string, Convo[]>, obj) => {
      const key = dayjs(obj.timestamp).format('D MMM, YYYY') 
      if (!acc[key]) acc[key] = []
      acc[key].push(obj)
      return acc
    },
    {}
  )

  const users = conversations.map(({ messages, ...user }) => user)

  return (
    <AppShell padding="md">
      {/* LEFT PANEL */}
      <Group align="flex-start" gap="md" style={{ height: '100%' }}>
        <Paper withBorder p="sm" w={320} style={{ height: '100%' }}>
          <Group justify="space-between" mb="sm">
            <Group gap="xs">
              <Text fw={700} size="lg">Inbox</Text>
              <MessagesSquare size={18} />
            </Group>

            <ActionIcon variant="subtle" onClick={() => setCreateConversationDialog(true)}>
              <Edit size={18} />
            </ActionIcon>
          </Group>

          <TextInput
            placeholder="Search chat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftSection={<SearchIcon size={14} />}
          />

          <ScrollArea h="calc(100vh - 160px)" mt="sm">
            <Stack gap="xs">
              {filteredChatList.map((chatUsr) => {
                const { id, profile, username, messages, fullName } = chatUsr
                const lastConvo = messages[0]
                const lastMsg =
                  lastConvo.sender === 'You'
                    ? `You: ${lastConvo.message}`
                    : lastConvo.message

                return (
                  <Fragment key={id}>
                    <Button
                      variant={selectedUser?.id === id ? 'light' : 'subtle'}
                      fullWidth
                      justify="flex-start"
                      onClick={() => {
                        setSelectedUser(chatUsr)
                        setMobileSelectedUser(chatUsr)
                      }}
                    >
                      <Group>
                        <Avatar src={profile} radius="xl">
                          {username}
                        </Avatar>

                        <div>
                          <Text size="sm" fw={500}>{fullName}</Text>
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            {lastMsg}
                          </Text>
                        </div>
                      </Group>
                    </Button>

                    <Divider />
                  </Fragment>
                )
              })}
            </Stack>
          </ScrollArea>
        </Paper>

        {/* RIGHT PANEL */}
        <Paper withBorder p="md" style={{ flex: 1, height: '100%' }}>
          {selectedUser ? (
            <Stack h="100%">
              {/* HEADER */}
              <Group justify="space-between">
                <Group>
                  <ActionIcon
                    variant="subtle"
                    onClick={() => setMobileSelectedUser(null)}
                  >
                    <ArrowLeft />
                  </ActionIcon>

                  <Avatar src={selectedUser.profile} radius="xl" />

                  <div>
                    <Text fw={500}>{selectedUser.fullName}</Text>
                    <Text size="xs" c="dimmed">
                      {selectedUser.title}
                    </Text>
                  </div>
                </Group>

                <Group gap="xs">
                  <ActionIcon variant="subtle"><Video /></ActionIcon>
                  <ActionIcon variant="subtle"><Phone /></ActionIcon>
                  <ActionIcon variant="subtle"><MoreVertical /></ActionIcon>
                </Group>
              </Group>

              {/* CHAT */}
              <ScrollArea style={{ flex: 1 }}>
                <Stack gap="sm">
                  {currentMessage &&
                    Object.keys(currentMessage).map((key) => (
                      <Fragment key={key}>
                        {currentMessage[key].map((msg, index) => (
                          <div
                            key={`${msg.sender}-${msg.timestamp}-${index}`}
                            style={{
                              alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                              background: msg.sender === 'You' ? '#3b82f6' : '#f1f3f5',
                              color: msg.sender === 'You' ? 'white' : 'black',
                              padding: 10,
                              borderRadius: 12,
                              maxWidth: 300,
                            }}
                          >
                            <Text size="sm">{msg.message}</Text>
                            <Text size="xs" ta="right" c="dimmed">
                              {dayjs(msg.timestamp).format('h:mm a')}
                            </Text>
                          </div>
                        ))}
                        <Text ta="center" size="xs" c="dimmed">
                          {key}
                        </Text>
                      </Fragment>
                    ))}
                </Stack>
              </ScrollArea>

              {/* INPUT */}
              <Group>
                <ActionIcon variant="subtle"><Plus /></ActionIcon>
                <ActionIcon variant="subtle"><ImagePlus /></ActionIcon>
                <ActionIcon variant="subtle"><Paperclip /></ActionIcon>

                <TextInput placeholder="Type message..." style={{ flex: 1 }} />

                <Button leftSection={<Send size={16} />}>Send</Button>
              </Group>
            </Stack>
          ) : (
            <Stack align="center" justify="center" h="100%">
              <MessagesSquare size={40} />
              <Text fw={600}>Your messages</Text>
              <Text size="sm" c="dimmed">
                Send a message to start a chat.
              </Text>

              <Button onClick={() => setCreateConversationDialog(true)}>
                Send message
              </Button>
            </Stack>
          )}
        </Paper>
      </Group>

      <NewChat
        users={users}
        onOpenChange={setCreateConversationDialog}
        open={createConversationDialogOpened}
      />
    </AppShell>
  )
}