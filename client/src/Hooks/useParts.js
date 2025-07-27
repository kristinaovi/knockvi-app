// src/hooks/useParts.js
import { useCallback } from 'react'
import useResource from './useResource'

export default function useParts() {
  const {
    items,
    loading,
    error,
    fetchAll,
    createOrUpdate,
    remove,
    exportCsv
  } = useResource('parts')

  // stable function
  const fetchParts = useCallback(
    (params = {}) => fetchAll({ with_trashed: false, ...params }),
    [fetchAll]
  )

  return {
    items,
    loading,
    error,
    fetchParts,
    createOrUpdate,
    remove,
    exportCsv
  }
}
