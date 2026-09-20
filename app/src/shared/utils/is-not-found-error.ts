const NOT_FOUND = 404

export const isNotFoundError = (error: unknown) => {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  const status = error as { statusCode?: number, status?: number, response?: { status?: number } }

  return status.statusCode === NOT_FOUND
    || status.status === NOT_FOUND
    || status.response?.status === NOT_FOUND
}
