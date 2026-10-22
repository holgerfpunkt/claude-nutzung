import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Limit } from '../types'

const limits = atom({ plugin: 'nutzung', key: 'limits' } as const, [] as Limit[])

const LABELS: Record<string, string> = {
  five_hour: '5 Std.',
  seven_day: 'Woche',
  spend_limit: 'Ausgaben',
}

const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

const pad = (n: number) => String(n).padStart(2, '0')

// "14:30" heute, sonst "Mo 09:00"
const formatReset = (iso: string | undefined, now: number) => {
  if (!iso) {
    return ''
  }
  const d = new Date(iso)
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`
  const isToday = new Date(now).toDateString() === d.toDateString()

  return isToday ? time : `${WEEKDAYS[d.getDay()]} ${time}`
}

const bar = (percent: number) => {
  const filled = Math.max(0, Math.min(10, Math.round(percent / 10)))

  return '█'.repeat(filled) + '░'.repeat(10 - filled)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    const usage = await $.session.usage()
    await update($, limits, () => usage.rateLimits)

    return result
  })

  on('session.measure', async ($, e, next) => {
    await update($, limits, () => e.rateLimits)

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const current = await read($, limits)
    if (e.props.hasSurvey || current.length === 0) {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)
    const now = await $.clock.now()

    return (
      <Box>
        {current.map((limit, i) => {
          const reset = formatReset(limit.resetsAt, now)
          const isHigh = limit.percentUsed >= 80

          return (
            <Text key={limit.kind} dimColor={!isHigh} color={isHigh ? 'red' : undefined}>
              {i > 0 ? '   ·   ' : ''}
              {LABELS[limit.kind] ?? limit.kind}: {bar(limit.percentUsed)} {limit.percentUsed}%
              {reset ? ` (Reset ${reset})` : ''}
            </Text>
          )
        })}
      </Box>
    )
  })
}
