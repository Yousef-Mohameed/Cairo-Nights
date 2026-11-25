import { useMemo, useSyncExternalStore } from 'react'

export type CartLine = {
  key: string
  itemId: string
  label: string
  price: number
  qty: number
  option?: string
}

export type CartInput = {
  id: string
  label: string
  price: number
  option?: string
}

type CartState = Record<string, CartLine>

const KEY = 'cn-cart-v2'

export const cartKey = (id: string, option?: string) => `${id}|${option ?? ''}`

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

export function addItem(input: CartInput) {
  const key = cartKey(input.id, input.option)
  const line = state[key]
  commit({
    ...state,
    [key]: {
      key,
      itemId: input.id,
      label: input.label,
      price: input.price,
      option: input.option,
      qty: (line?.qty ?? 0) + 1,
    },
  })
}

export function removeItem(key: string) {
  const line = state[key]
  if (!line) return
  const next = { ...state }
  if (line.qty <= 1) delete next[key]
  else next[key] = { ...line, qty: line.qty - 1 }
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