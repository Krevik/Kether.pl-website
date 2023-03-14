import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Command } from '../../../models/commandModels';
import { useEffect, useState } from 'react';
import commandsFileLoc from '../../../resources/commands/commands.json';

export default function CommandsSection() {
    const [commands, setCommands] = useState<Command[]>([]);

    //load commands from file
    useEffect(() => {
        const localCommands: Command[] = [];
        commandsFileLoc.forEach((readCommand: Command) => {
            localCommands.push(readCommand);
        });
        setCommands(localCommands);
    }, []);

    return (
        <div className="section">
            <DataTable
                value={commands}
                responsiveLayout="scroll"
                style={{
                    backgroundColor: 'transparent',
                    background: 'transparent',
                }}
            >
                <Column field="command" header="Command"></Column>
                <Column field="description" header="Description"></Column>
            </DataTable>
        </div>
    );
}
