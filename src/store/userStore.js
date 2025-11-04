import { create } from 'zustand';

const useUserStore = create((set) => ({
  users: [],
  selectedUser: null,
  setUsers: (users) => set({ users }),
  setSelectedUser: (user) => set({ selectedUser: user }),
}));

export default useUserStore;
