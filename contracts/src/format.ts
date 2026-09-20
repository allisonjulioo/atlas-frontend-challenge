const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const decimal = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const compact = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const monthYear = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
})

export const formatPrice = (value: number) => brl.format(value)

export const formatHourlyRate = (value: number) => `${brl.format(value)}/h`

export const formatRating = (value: number) => decimal.format(value)

export const formatReviewCount = (value: number) => compact.format(value)

export const formatMonthYear = (isoDate: string) => monthYear.format(new Date(isoDate))

export const formatDistance = (km: number) => {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`
  }

  return `${decimal.format(km)} km`
}

export const formatResponseTime = (minutes: number) => {
  if (minutes < 60) {
    return `Responde em ~${minutes} min`
  }

  return `Responde em ~${Math.round(minutes / 60)} h`
}
