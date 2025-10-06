// src/hooks/useInventory.js
import { useCallback } from "react"
import useResource from "./useResource"

export default function useInventory() {
  const {
    items,
    item,
    loading,
    error,
    fetchAll,
    fetchOne,
    create,
    update,
    remove,
    exportCsv,
    createOrUpdate,
  } = useResource("inventory")

  // alias biar namanya jelas
  const fetchInventory = useCallback(
    (params = {}) => fetchAll({ ...params }),
    [fetchAll]
  )

  return {
    items,
    item,
    loading,
    error,
    fetchInventory, // <--- sekarang ini function
    fetchOne,
    create,
    update,
    remove,
    exportCsv,
    createOrUpdate
  }
}
