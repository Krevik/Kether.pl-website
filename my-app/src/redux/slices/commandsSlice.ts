import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommandEntry } from '../../models/commandModels';

interface commandsSliceProps {
    commands: CommandEntry[];
}

const initialState: commandsSliceProps = {
    commands: [],
};

const commandsSlice = createSlice({
    name: 'commandsSlice',
    initialState: initialState,
    reducers: {
        setCommands(state, action: PayloadAction<CommandEntry[]>) {
            state.commands = action.payload;
        },
    },
});

export const commandsActions = commandsSlice.actions;
export const commandsReducer = commandsSlice.reducer;
