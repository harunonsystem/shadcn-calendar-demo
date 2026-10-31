import type { AvailabilityRange, AvailabilityWindow } from '@/types/calendar'

const overlapsWindow = (range: AvailabilityRange, window: AvailabilityWindow): boolean => {
  return range.start < window.end && range.end > window.start
}

const sharesResource = (range: AvailabilityRange, requestedResourceIds: Set<string>): boolean => {
  return range.resourceIds.some((resourceId) => requestedResourceIds.has(resourceId))
}

export const getAvailabilityRangesForWindow = (
  ranges: AvailabilityRange[],
  window: AvailabilityWindow,
): AvailabilityRange[] => {
  const requestedResourceIds = new Set(window.resourceIds)
  return ranges.filter(
    (range) => overlapsWindow(range, window) && sharesResource(range, requestedResourceIds),
  )
}
