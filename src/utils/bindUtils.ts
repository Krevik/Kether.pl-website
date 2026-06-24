import { BindEntry, BindSuggestionEntry } from "../models/bindsModels";

export const trimBindAuthor = (bind: BindEntry | BindSuggestionEntry) => {
    return {
        ...bind,
        author: bind.author.replace(':', '').trim(),
    };
};
