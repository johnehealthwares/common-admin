import type { Participant } from '../types';

export function getParticipantName(participant?: Participant) {
  if (!participant) {
    return 'Unknown participant';
  }

  const fullName = [participant.firstName, participant.lastName].filter(Boolean).join(' ').trim();

  return fullName || participant.email || participant.phone || participant.id;
}

export function getParticipantInitials(participant?: Participant) {
  const label = getParticipantName(participant);
  return label
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}
