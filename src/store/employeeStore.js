import { create } from 'zustand';
import { mockEmployees } from '../data/mockData';

const useEmployeeStore = create((set, get) => ({
  employees: [...mockEmployees],
  selectedEmployee: null,
  filters: { department: '', status: '', search: '', employmentType: '' },
  isLoading: false,

  fetchEmployees: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 500));
    set({ employees: [...mockEmployees], isLoading: false });
  },

  addEmployee: (employee) => {
    const newEmp = { ...employee, id: `EMP${String(get().employees.length + 1).padStart(3, '0')}` };
    set((state) => ({ employees: [...state.employees, newEmp] }));
    return newEmp;
  },

  updateEmployee: (id, updates) => {
    set((state) => ({
      employees: state.employees.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      selectedEmployee: state.selectedEmployee?.id === id ? { ...state.selectedEmployee, ...updates } : state.selectedEmployee,
    }));
  },

  deleteEmployee: (id) => {
    set((state) => ({
      employees: state.employees.filter((e) => e.id !== id),
      selectedEmployee: state.selectedEmployee?.id === id ? null : state.selectedEmployee,
    }));
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  selectEmployee: (employee) => {
    set({ selectedEmployee: employee });
  },

  getFilteredEmployees: () => {
    const { employees, filters } = get();
    return employees.filter((e) => {
      if (filters.department && e.department !== filters.department) return false;
      if (filters.status && e.status !== filters.status) return false;
      if (filters.employmentType && e.employmentType !== filters.employmentType) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const match = `${e.firstName} ${e.lastName} ${e.email} ${e.designation} ${e.department}`.toLowerCase();
        if (!match.includes(q)) return false;
      }
      return true;
    });
  },
}));

export default useEmployeeStore;
