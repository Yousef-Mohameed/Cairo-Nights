import { useSyncExternalStore } from 'react'

// النكهة المختارة لكل صنف (بتتشارك بين زراير النكهات وزرار الإضافة)
let selected: Record<string, string> = {}
const listeners = new Set<() => void>()

export function setFlavor(id: string, option: string) {
  selected = { ...selected, [id]: option }
  listeners.forEach((l) => l())
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

const getSnapshot = () => selected

// لو الزبون لسه ما اختارش، بتبقى أول نكهة
export function useFlavor(id: string, options?: string[]): string | undefined {
  const all = useSyncExternalStore(subscribe, getSnapshot)
  return all[id] ?? options?.[0]
}