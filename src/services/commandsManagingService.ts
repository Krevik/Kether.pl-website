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
    getCommands: async () => {
        try {
            const response = await fetch(`${API_PATHS.COMMANDS}/getCommands`, {
                method: 'get',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const commandEntries: CommandEntry[] = await response.json();
            appStore.dispatch(commandsActions.setCommands(commandEntries));
        } catch (error) {
            notificationManager.ERROR(
                `Error while fetching commands: ${error.message}`
            );
        }
    },
    addNewCommand: async (command: CommandEntry) => {
        try {
            const response = await fetch(`${API_PATHS.COMMANDS}/addCommand`, {
                method: 'post',
                body: new URLSearchParams({
                    command: command.command,
                    description: command.description,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
            commandsManagingService.getCommands();
            return responseData;
        } catch (error) {
            notificationManager.ERROR(
                `Error while adding new command: ${error.message}`
            );
            throw error;
        }
    },
    deleteCommand: async (command: CommandEntry) => {
        try {
            const response = await fetch(`${API_PATHS.COMMANDS}/deleteCommand`, {
                method: 'post',
                body: new URLSearchParams({
                    id: `${command.id}`,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonedResponse = await response.json();
            commandsManagingService.getCommands();
            return jsonedResponse.message;
        } catch (error) {
            notificationManager.ERROR(
                `Error while deleting command: ${error.message}`
            );
            throw error;
        }
    },
    updateCommand: async (newCommandData: CommandEntry) => {
        try {
            const response = await fetch(`${API_PATHS.COMMANDS}/updateCommand`, {
                method: 'post',
                body: new URLSearchParams({
                    id: `${newCommandData.id}`,
                    command: `${newCommandData.command}`,
                    description: `${newCommandData.description}`,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonedResponse = await response.json();
            commandsManagingService.getCommands();
            return jsonedResponse.message;
        } catch (error) {
            notificationManager.ERROR(
                `Error while updating command: ${error.message}`
            );
            throw error;
        }
    },
};

const useServerCommandsLoader = () => {
    useEffect(() => {
        commandsManagingService.getCommands();
    }, []);
};
