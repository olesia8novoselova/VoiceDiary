import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recordings: [],
  currentRecording: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const recordingsSlice = createSlice({
  name: "recordings",
  initialState,
  reducers: {
    setCurrentRecording: (state, action) => {
      state.currentRecording = action.payload;
    },
    clearCurrentRecording: (state) => {
      state.currentRecording = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.status = "succeeded";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  },
});

export const { setCurrentRecording, clearCurrentRecording, setError } = recordingsSlice.actions;

export const selectRecordings = (state) => state.recordings.recordings;
export const selectCurrentRecording = (state) => state.recordings.currentRecording;
export const selectRecordingsStatus = (state) => state.recordings.status;
export const selectRecordingsError = (state) => state.recordings.error;

export default recordingsSlice.reducer;