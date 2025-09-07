import useResource from './useResource'
import { useCallback } from 'react'
import api from '../api/axios'
import { toast } from 'react-toastify'

export default function useUsers() {
  const {
    items,
    loading,
    error,
    fetchAll,
    createOrUpdate,
    remove,
    exportCsv
  } = useResource('users')

  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get('/users/me')
      return res.data // langsung return user object
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch user detail'
      toast.error(message)
      throw err
    }
  }, [])

  return {
    items,
    loading,
    error,
    createOrUpdate,
    remove,
    exportCsv,
    fetchAll,
    fetchMe
  }
}
