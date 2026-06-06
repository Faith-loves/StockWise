import { useEffect, useState } from "react"
import { readStorage, writeStorage } from "../services/storage"

export function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => readStorage(key, initialValue))

  useEffect(() => {
    writeStorage(key, value)
  }, [key, value])

  return [value, setValue]
}
