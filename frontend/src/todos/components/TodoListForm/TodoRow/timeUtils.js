import { assetUrl } from '../../../../assetUrl'

export const RemainingColor = {
  Success: 'success',
  Default: 'default',
  Warning: 'warning',
  Error: 'error',
}

export const REMAINING_ICON = {
  [RemainingColor.Success]: assetUrl('checkmark_circle.svg'),
  [RemainingColor.Default]: assetUrl('pending_clock.svg'),
  [RemainingColor.Warning]: assetUrl('warning_circle.svg'),
  [RemainingColor.Error]: assetUrl('warning_circle.svg'),
}

export const STATUS_BAR_BACKGROUND = {
  [RemainingColor.Success]: 'rgb(220, 244, 229)',
  [RemainingColor.Default]: 'rgb(153, 209, 255)',
  [RemainingColor.Warning]: 'rgb(249, 169, 151)',
  [RemainingColor.Error]: 'rgb(249, 169, 151)',
}

const MS_PER_DAY = 1000 * 60 * 60 * 24

const daysUntil = (dateStr) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr + 'T00:00:00')
  return Math.round((target - today) / MS_PER_DAY)
}

const pluralizeDays = (n) => `${n} day${n === 1 ? '' : 's'}`

export const getRemainingText = (dueDate) => {
  if (!dueDate) return null
  const days = daysUntil(dueDate)
  if (days === 0) return { text: 'Due today', color: RemainingColor.Warning }
  if (days > 0) return { text: `${pluralizeDays(days)} left`, color: RemainingColor.Default }
  return { text: `Overdue by ${pluralizeDays(-days)}`, color: RemainingColor.Error }
}
