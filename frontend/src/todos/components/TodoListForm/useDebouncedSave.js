import { useCallback, useEffect, useRef, useState } from 'react'

export const SaveStatus = {
  Saving: 'saving',
  Saved: 'saved',
  Error: 'error',
}

export const useDebouncedSave = ({ delay = 300, savedDuration = 2000 } = {}) => {
  const timers = useRef({})
  const [status, setStatus] = useState({})

  useEffect(() => {
    const active = timers.current
    return () => Object.values(active).forEach(clearTimeout)
  }, [])

  const cancel = useCallback((key) => {
    if (timers.current[key]) {
      clearTimeout(timers.current[key])
      delete timers.current[key]
    }
  }, [])

  const save = useCallback(
    (key, perform) => {
      cancel(key)
      setStatus((prev) => ({ ...prev, [key]: SaveStatus.Saving }))
      timers.current[key] = setTimeout(() => {
        perform()
          .then(() => {
            setStatus((prev) => ({ ...prev, [key]: SaveStatus.Saved }))
            setTimeout(
              () =>
                setStatus((prev) => {
                  const { [key]: _, ...rest } = prev
                  return rest
                }),
              savedDuration,
            )
          })
          .catch(() => setStatus((prev) => ({ ...prev, [key]: SaveStatus.Error })))
        delete timers.current[key]
      }, delay)
    },
    [cancel, delay, savedDuration],
  )

  return { status, save, cancel }
}
