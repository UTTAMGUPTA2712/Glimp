import { User } from './auth'

export function getEntitlementStatus(user: User | null) {
  if (!user) {
    return {
      entitled: false,
      reason: 'No user session'
    }
  }

  if (user.status === 'deleted') {
    return {
      entitled: false,
      reason: 'Account deleted'
    }
  }

  if (!['active', 'trialing'].includes(user.status)) {
    return {
      entitled: false,
      reason: 'No active subscription'
    }
  }

  if (user.current_period_end && new Date(user.current_period_end) <= new Date()) {
    return {
      entitled: false,
      reason: 'Subscription expired'
    }
  }

  return {
    entitled: true,
    reason: 'Active subscription'
  }
}