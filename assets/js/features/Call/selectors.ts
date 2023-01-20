import { ConnectionState } from 'features/Dock/slice'
import selectors from 'selectors'
import { RootState } from 'state'
import { CallParticipantStatus } from './slice'

export function getParticipantStatusByUserId(
  state: RootState,
  userId: string
): CallParticipantStatus | undefined {
  return state.call.participantStatus[userId]
}

export function shouldReconnect(state: RootState): boolean {
  const status = selectors.dock.getSelfConnectionStatus(state)
  return (
    status?.dailyCall === ConnectionState.Disconnected &&
    status.internet === ConnectionState.Connected
  )
}
