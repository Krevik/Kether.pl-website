import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface uiSliceProps {
    isNavbarVisible: boolean;
}

const initialState: uiSliceProps = {
    isNavbarVisible: true,
};

const uiSlice = createSlice({
    name: 'uiSlice',
    initialState: initialState,
    reducers: {
        setNavbarVisibility(state, action: PayloadAction<boolean>) {
            state.isNavbarVisible = action.payload;
        },
        toggleNavbarVisibility(state) {
            state.isNavbarVisible = !state.isNavbarVisible;
        },
    },
});

export const uiActions = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
