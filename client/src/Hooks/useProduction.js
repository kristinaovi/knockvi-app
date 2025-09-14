// Hooks/useProduction.js
import useResource from './useResource';

export default function useProduction() {
  return useResource('production'); // ini nanti bisa call /production/save
}
