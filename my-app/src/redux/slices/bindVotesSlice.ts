import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    BindEntry,
    BindVotingEntry,
    MappedBindVote,
} from '../../models/bindsModels';

interface bindVotesSliceProps {
    votes: BindVotingEntry[];
    mappedBindVotes: MappedBindVote[];
}

const initialState: bindVotesSliceProps = {
    votes: [],
    mappedBindVotes: [],
};

const bindVotesSlice = createSlice({
    name: 'bindVotesSlice',
    initialState: initialState,
    reducers: {
        setVotes(state, action: PayloadAction<BindVotingEntry[]>) {
            state.votes = action.payload;
        },
        setMappedBindVotes(state, action: PayloadAction<MappedBindVote[]>) {
            state.mappedBindVotes = action.payload;
        },
    },
});

export const bindVotesActions = bindVotesSlice.actions;
export const bindVotesReducer = bindVotesSlice.reducer;
