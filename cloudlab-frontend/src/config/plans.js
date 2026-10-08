// PLACEHOLDER pricing and copy. Change freely; the backend only knows the plan ids
// MONTHLY, YEARLY and LIFETIME.
export const FREE_FEATURES = [
  'All provider-neutral beginner topics',
  'Two free projects',
  'Progress tracking',
]

export const PRO_FEATURES = [
  'Everything in Free',
  'AWS or Azure track',
  'All paid projects',
  'Completion certificate',
]

export const LIFETIME_FEATURES = [
  'Everything in Pro',
  'One payment, no renewals',
  'Every future topic and project',
]

export const PRO = {
  monthly: { id: 'MONTHLY', amount: 499, cadence: 'per month' },
  yearly: { id: 'YEARLY', amount: 4999, cadence: 'per year', note: 'Two months free' },
}

export const LIFETIME = { id: 'LIFETIME', amount: 9999, cadence: 'one time' }

export const formatINR = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`
