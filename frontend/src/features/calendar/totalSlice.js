import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totals: null,
  loading: false,
  error: null
};

const totalsSlice = createSlice({
  name: "totals",
  initialState,
  reducers: {
    setTotals: (state, action) => {
      state.totals = action.payload;
      state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearTotals: (state) => {
      state.totals = null;
    }
  }
});

export const { setTotals, setLoading, setError, clearTotals } = totalsSlice.actions;

export const selectTotals = (state) => state.totals.totals;
export const selectTotalsLoading = (state) => state.totals.loading;
export const selectTotalsError = (state) => state.totals.error;

export default totalsSlice.reducer;