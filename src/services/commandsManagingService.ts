import { useEffect } from 'react';
import { CommandEntry } from '../models/commandModels';
import { appStore } from '../redux/store';
import { commandsActions } from '../redux/slices/commandsSlice';
import { API_PATHS } from '../utils/apiPaths';
import { notificationManager } from '../utils/notificationManager';

export const commandsManagingService = {
    useCommandsLoadingService: () => {
        useServerCommandsLoader();
    },
    getCommands: () => {
        return fetch(`${API_PATHS.COMMANDS}/getCommands`, {
            method: 'get',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((commandEntries: CommandEntry[]) => {
                appStore.dispatch(commandsActions.setCommands(commandEntries));
            })
            .catch((error) => {
                notificationManager.ERROR(
                    `Error while fetching commands: ${error.message}`
                );
            });
    },
    addNewCommand: (command: CommandEntry) => {
        return fetch(`${API_PATHS.COMMANDS}/addCommand`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                command: command.command,
                description: command.description,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((responseData) => {
                commandsManagingService.getCommands();
                return responseData;
            })
            .catch((error) => {
                notificationManager.ERROR(
                    `Error while adding new command: ${error.message}`
                );
                throw error;
            });
    },
    deleteCommand: (command: CommandEntry) => {
        return fetch(`${API_PATHS.COMMANDS}/deleteCommand`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: command.id,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((jsonedResponse) => {
                commandsManagingService.getCommands();
                return jsonedResponse.message;
            })
            .catch((error) => {
                notificationManager.ERROR(
                    `Error while deleting command: ${error.message}`
                );
                throw error;
            });
    },
    updateCommand: (newCommandData: CommandEntry) => {
        return fetch(`${API_PATHS.COMMANDS}/updateCommand`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: newCommandData.id,
                command: newCommandData.command,
                description: newCommandData.description,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((jsonedResponse) => {
                commandsManagingService.getCommands();
                return jsonedResponse.message;
            })
            .catch((error) => {
                notificationManager.ERROR(
                    `Error while updating command: ${error.message}`
                );
                throw error;
            });
    },
};

const useServerCommandsLoader = () => {
    useEffect(() => {
        commandsManagingService.getCommands();
    }, []);
};
