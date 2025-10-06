// src/Hooks/useInvoices.js
import useResource from './useResource'
import api from '../api/axios'

export default function useInvoices() {
  const resource = useResource('invoices')

  // method khusus untuk dapat nomor invoice berikutnya
  const getNext = async (customerCode) => {
    try {
      const res = await api.get('/invoices/next', {
        params: { customer: customerCode },
      })
      return res.data
    } catch (err) {
      console.error('Failed to get next invoice number', err)
      throw err
    }
  }

  return {
    ...resource,
    getNext,   // tambahkan di return
  }
}
