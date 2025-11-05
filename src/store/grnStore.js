import { create } from 'zustand';
import { toast } from 'sonner';

const useGrnStore = create((set) => ({
  grns: [],
  loading: false,
  error: null,
  fetchGrns: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/grn');
      const data = await res.json();
      set({ grns: data, loading: false });
    } catch (error) {
      set({ error, loading: false });
      toast.error('Failed to fetch GRNs');
    }
  },
  addGrn: async (grn) => {
    try {
      const res = await fetch('/api/grn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grn),
      });
      if (!res.ok) throw new Error('Failed to create GRN');
      const newGrn = await res.json();
      set((state) => ({ grns: [...state.grns, newGrn.data] }));
      toast.success('GRN created successfully');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  },
  updateGrn: async (grnCode, updatedGrn) => {
    try {
      const res = await fetch(`/api/grn/${grnCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGrn),
      });
      if (!res.ok) throw new Error('Failed to update GRN');
      const data = await res.json();
      set((state) => ({
        grns: state.grns.map((grn) =>
          grn.grnCode === grnCode ? data.data : grn
        ),
      }));
      toast.success('GRN updated successfully');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  },
  removeGrn: async (grnCode) => {
    try {
      const res = await fetch(`/api/grn/${grnCode}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete GRN');
      set((state) => ({
        grns: state.grns.filter((grn) => grn.grnCode !== grnCode),
      }));
      toast.success('GRN deleted successfully');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  },
}));

export default useGrnStore;
