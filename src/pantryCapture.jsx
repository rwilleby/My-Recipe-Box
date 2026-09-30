import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import PhotoInventoryTransfer from './components/PhotoInventoryTransfer.jsx';
const KEY = 'rrb_masterKitchenInventory_v1';
function PocketPantry() {
  const [inventory, setInventory] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY) || '{"records":{},"customItems":[]}'); } catch { return { records: {}, customItems: [] }; } });
  const [error, setError] = useState('');
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(inventory)); setError(''); } catch { setError('Inventory could not be saved on this device. Keep your transfer file and import it into RRB.'); } }, [inventory]);
  useEffect(() => { const refresh = event => { if (event.key === KEY && event.newValue) { try { setInventory(JSON.parse(event.newValue)); } catch {} } }; window.addEventListener('storage', refresh); return () => window.removeEventListener('storage', refresh); }, []);
  return <>{error && <p role="alert">{error}</p>}<PhotoInventoryTransfer masterInventory={inventory} setMasterInventory={setInventory} onClose={() => { window.location.href = '/kitchen-inventory/'; }} /></>;
}
createRoot(document.getElementById('root')).render(<PocketPantry />);
