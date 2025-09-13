// src/hooks/useChangePassword.js
import { useState } from "react"; // <-- wajib ada
import api from '../api/axios'
import { toast } from "react-toastify"; // <-- wajib ada

export function useChangePassword() {
  const [loading, setLoading] = useState(false);

  const changePassword = async (oldPassword, newPassword) => {
    console.log("Hook dipanggil dengan:", oldPassword, newPassword); // Debugging
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log("Token ditemukan:", token); // Debugging

      const res = await api.put(
        "/api/change-password", // pastikan sesuai backend route kamu
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Password changed successfully");
      return true;
    } catch (err) {
      console.error("Change password error:", err); // Debugging
      if(err.response?.data?.errors) {
        err.response?.data?.errors.map((item) => {
          toast.error(
            item.msg
          )
        })
        
      }
      else {
        toast.error(err.response?.data?.message || "Failed to change password");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading };
}
