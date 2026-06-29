import { useState, useCallback } from 'react'

/**
 * useLocalStorage — like useState but persisted to localStorage.
 * @param {string} key
 * @param {*} initialValue
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (err) {
        console.warn(`useLocalStorage: failed to persist "${key}"`, err)
      }
      return valueToStore
    })
  }, [key])

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (err) {
      console.warn(`useLocalStorage: failed to remove "${key}"`, err)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

export default useLocalStorage
