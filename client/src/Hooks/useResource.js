// src/hooks/useResource.js
import { useState, useCallback } from 'react'
import api from '../api/axios'
import { toast } from 'react-toastify'

export default function useResource(resource) {
  const [items, setItems]     = useState([])
  const [item, setItem]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const fetchAll = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const res = await api.get(`/${resource}`, { params })
      setItems(res.data)
      return res.data
    } catch (err) {
      setError(err)
      if (err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error(err.message || `Failed to fetch ${resource}`)
      }
      throw err
    } finally {
      setLoading(false)
    }
  }, [resource])

  const fetchOne = useCallback(async id => {
    setLoading(true)
    try {
      const res = await api.get(`/${resource}/${id}`)
      setItem(res.data)
      return res.data
    } catch (err) {
      setError(err)
      if (err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error(err.message || `Failed to fetch ${resource} detail`)
      }
      throw err
    } finally {
      setLoading(false)
    }
  }, [resource])

  const createOrUpdate = useCallback(async data => {
    try {
      const res = await api.post(`/${resource}`, data)
      return res.data
    } catch (err) {
      if (err.response?.status === 422 && Array.isArray(err.response.data.errors)) {
        err.response.data.errors.forEach(e => toast.error(`${e.path}: ${e.msg}`))
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error(err.message || `Failed to save ${resource}`)
      }
      throw err
    }
  }, [resource])

  const remove = useCallback(async id => {
    try {
      await api.delete(`/${resource}/${id}`)
    } catch (err) {
      toast.error(err.message || `Failed to delete from ${resource}`)
      throw err
    }
  }, [resource])

  const exportCsv = useCallback(async () => {
    try {
      const res = await api.get(`/${resource}/export/csv`, {
        responseType: 'blob'
      })
      const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `${resource}.csv`
      link.click()
    } catch (err) {
      toast.error(err.message || `Failed to export ${resource}`)
      throw err
    }
  }, [resource])

  return {
    items,
    item,
    loading,
    error,
    fetchAll,
    fetchOne,
    createOrUpdate,
    remove,
    exportCsv
  }
}
