// src/hooks/useResource.js
import { useState, useCallback } from 'react'
import api from '../api/axios'
import { toast } from 'react-toastify'

export default function useResource(resource) {
  const [items, setItems] = useState([])
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all
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

  // Fetch one
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

  // Create (khusus insert baru)
  const create = useCallback(async data => {
    try {
      const res = await api.post(`/${resource}`, data)
      toast.success(`${resource} created successfully`)
      return res.data
    } catch (err) {
      if (err.response?.status === 422 && Array.isArray(err.response.data.errors)) {
        err.response.data.errors.forEach(e =>
          toast.error(`${e.path}: ${e.msg}`)
        )
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error(err.message || `Failed to create ${resource}`)
      }
      throw err
    }
  }, [resource])

  // Update (opsional)
  const update = useCallback(async (id, data) => {
    try {
      const res = await api.put(`/${resource}/${id}`, data)
      toast.success(`${resource} updated successfully`)
      return res.data
    } catch (err) {
      if (err.response?.status === 422 && Array.isArray(err.response.data.errors)) {
        err.response.data.errors.forEach(e =>
          toast.error(`${e.path}: ${e.msg}`)
        )
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error(err.message || `Failed to update ${resource}`)
      }
      throw err
    }
  }, [resource])

  // Create or Update (opsional, untuk kompatibilitas lama)
  const createOrUpdate = useCallback(async data => {
    try {
      const res = await api.post(`/${resource}`, data)
      toast.success(`Create or Update ${resource} success`)
      return res.data
    } catch (err) {
      if (err.response?.status === 422 && Array.isArray(err.response.data.errors)) {
        toast.error(`Please Complete all Required Field`)
        err.response.data.errors.forEach(e =>
          toast.error(`${e.path}: ${e.msg}`)
        )
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error(err.message || `Failed to save ${resource}`)
      }
      throw err
    }
  }, [resource])

  // Delete
  const remove = useCallback(async id => {
    try {
      await api.delete(`/${resource}/${id}`)
      toast.success(`${resource} deleted successfully`)
    } catch (err) {
      toast.error(err.message || `Failed to delete from ${resource}`)
      throw err
    }
  }, [resource])

  // Export CSV
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
    create,          // <-- baru ditambahkan
    update,          // <-- tambahan (jika perlu edit)
    createOrUpdate,  // <-- tetap ada untuk kompatibilitas
    remove,
    exportCsv
  }
}
