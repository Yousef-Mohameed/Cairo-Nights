import { useMemo, useSyncExternalStore } from 'react'

export type CartLine = { name: string; price: number; qty: number }
type CartState = Record<string, CartLine>

const KEY = 'cn-cart'

function load(): CartState {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as CartState) : {}
  } catch {
    return {}
  }
}

// لو الزبون فتح الموقع من باركود الطاولة (?table=5) بنحفظ رقم الطاولة
function captureTable(): string {
  try {
    const t = new URLSearchParams(window.location.search).get('table')
    if (t && /^\d{1,3}$/.test(t)) sessionStorage.setItem('cn-table', t)
    return sessionStorage.getItem('cn-table') ?? ''
  } catch {
    return ''
  }
}

export const tableFromQr = captureTable()

let state: CartState = load()
const listeners = new Set<() => void>()

function commit(next: CartState) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // لو التخزين مش متاح نكمّل من غيره
  }
  listeners.forEach((l) => l())
}

export function addItem(name: string, price: number) {
  const line = state[name]
  commit({ ...state, [name]: { name, price, qty: (line?.qty ?? 0) + 1 } })
}

export function removeItem(name: string) {
  const line = state[name]
  if (!line) return
  const next = { ...state }
  if (line.qty <= 1) delete next[name]
  else next[name] = { ...line, qty: line.qty - 1 }
  commit(next)
}

export function clearCart() {
  commit({})
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

const getSnapshot = () => state

export function useCart() {
  const cart = useSyncExternalStore(subscribe, getSnapshot)
  return useMemo(() => {
    const lines = Object.values(cart)
    return {
      cart,
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      total: lines.reduce((s, l) => s + l.qty * l.price, 0),
    }
  }, [cart])
}