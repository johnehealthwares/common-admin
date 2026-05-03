import { useQuery } from '@tanstack/react-query'
import { conversationApi } from '@/lib/conversation-api'
import { getArrayPayload } from '@/features/components/utils'

export function useParticipantSearch(debouncedPhone: string, session: any) {
  return useQuery({
    queryKey: ['participants', debouncedPhone],
    queryFn: async () => {
      const res = await conversationApi.get('/participants', {
        params: { search: debouncedPhone, attribute: 'phone' },
      })
      return getArrayPayload(res.data)
    },
    enabled: !session && debouncedPhone.trim().length >= 3,
  })
}