import { useEffect } from 'react';
import {
    AttachedBindVoteData,
    BindEntry,
    BindVote,
    BindVotingType,
} from '../models/bindsModels';
import { AppState, appStore } from '../redux/store';
import { bindsActions } from '../redux/slices/bindsSlice';
import { API_PATHS, apiPaths } from '../utils/apiPaths';
import { CommandEntry } from '../models/commandModels';
import { commandsActions } from '../redux/slices/commandsSlice';

export const commandsManagingService = {
    useCommandsLoadingService: () => {
        useServerCommandsLoader();
    },
    getCommands: () => {
        fetch(`${API_PATHS.COMMANDS}/getCommands`, {
            method: 'get',
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then((commandEntries: CommandEntry[]) => {
                appStore.dispatch(commandsActions.setCommands(commandEntries));
            });
    },
    addNewCommand: (command: CommandEntry) => {
        return fetch(`${API_PATHS.COMMANDS}/addCommand`, {
            method: 'post',
            body: new URLSearchParams({
                command: command.command,
                description: command.description,
            }),
        }).then(async (response) => {
            if (response.ok) {
                commandsManagingService.getCommands();
                return response.json().then((response) => {
                    return response;
                });
            } else {
                throw new Error("Couldn't add the command");
            }
        });
    },
    deleteCommand: (command: CommandEntry) => {
        return fetch(`${API_PATHS.COMMANDS}/deleteCommand`, {
            method: 'post',
            body: new URLSearchParams({
                id: `${command.id}`,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json().then((jsonedResponse) => {
                        commandsManagingService.getCommands();
                        return jsonedResponse.message;
                    });
                } else {
                    throw new Error("Couldn't delete command");
                }
            })
            .catch((error) => {
                throw new Error(error);
            });
    },
    updateCommand: (newCommandData: CommandEntry) => {
        return fetch(`${API_PATHS.COMMANDS}/updateCommand`, {
            method: 'post',
            body: new URLSearchParams({
                id: `${newCommandData.id}`,
                command: `${newCommandData.command}`,
                description: `${newCommandData.description}`,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json().then((jsonedResponse) => {
                        commandsManagingService.getCommands();
                        return jsonedResponse.message;
                    });
                } else {
                    throw new Error("Couldn't update command");
                }
            })
            .catch((error) => {
                throw new Error(error);
            });
    },
};

const useServerCommandsLoader = () => {
    useEffect(() => {
        commandsManagingService.getCommands();
    }, []);
};
