export const debounce = <T extends (...args: never[]) => void>(callback: T, delay: number) => {
  let timer: ReturnType<typeof setTimeout> | undefined

  const run = (...args: Parameters<T>) => {
    clearTimeout(timer)

    timer = setTimeout(() => callback(...args), delay)
  }

  run.cancel = () => {
    clearTimeout(timer)
  }

  run.flush = (...args: Parameters<T>) => {
    clearTimeout(timer)

    callback(...args)
  }

  return run
}
