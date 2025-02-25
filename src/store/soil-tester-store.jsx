import { create } from 'zustand';

export const useSoilTesterStore = create((set) => ({
  soilTesters: [],
  addSoilTester: (tester) => {
    set((state) => ({
      soilTesters: [
        ...state.soilTesters,
        {
          ...tester,
          id: Math.random().toString(36).substring(7),
        },
      ],
    }));
  },
  updateSoilTester: (id, status) => {
    set((state) => ({
      soilTesters: state.soilTesters.map((tester) =>
        tester.id === id ? { ...tester, status } : tester
      ),
    }));
  },
}));