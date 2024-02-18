import { RootState } from '@apps/acf-options-page/src/store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type BatchStore = {
  visible: boolean;
  error?: string;
  message?: string;
};

const initialState: BatchStore = { visible: false };

const slice = createSlice({
  name: 'batch',
  initialState,
  reducers: {
    switchBatchModal: (state) => {
      window.dataLayer.push({ event: 'modal', name: 'batch', visibility: !state.visible });
      state.visible = !state.visible;
    },
    setBatchMessage: (state, action: PayloadAction<string | undefined>) => {
      state.message = action.payload;
      state.error = undefined;
    },
    setBatchError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.message = undefined;
    },
  },
});

export const { switchBatchModal, setBatchMessage, setBatchError } = slice.actions;

export const batchSelector = (state: RootState) => state.batch;
export const batchReducer = slice.reducer;
