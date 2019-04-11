import { join } from 'path'
import { getInput, setResult, TaskResult, getBoolInput } from 'azure-pipelines-task-lib';
import { execSync } from "child_process";
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { CommandLineResult } from './commandLineResult';
import { ApiCompatCommand } from './apiCompatCommand';

class App {
    public run(): void {
        try {
            // Create ApiCompat path
            const ApiCompatPath = join(__dirname, '..', 'ApiCompat', 'Microsoft.DotNet.ApiCompat.exe');

            // Get the binaries to compare and create the command to run
            const inputFiles: string = this.getInputFiles();
            const apiCompatCommands: ApiCompatCommand = new ApiCompatCommand(ApiCompatPath, inputFiles);

            // Show the ApiCompat version
            console.log(execSync(apiCompatCommands.version).toString());

            // Run the ApiCompat command
            this.runCommand(apiCompatCommands.command);
        } catch (error) {
            setResult(TaskResult.Failed, error);
        }
    }

    private getInputFiles(): string {
        const filesName: string[] = [];

        getInput('contractsFileName').split(' ').forEach((file: string): void => {
            const fullFilePath: string = join(this.validatePath('contractsRootFolder'), file);
            if (existsSync(fullFilePath)) {
                filesName.push(fullFilePath);
            }
        });

        if (filesName.length == 0) {
            throw new Error('The specified contracts were not found.');
        }

        return filesName.join(',');
    }

    private runCommand(command: string): void {
        console.log(command);

        const result = execSync(command).toString();
        const commandLineResult = new CommandLineResult(result);
        const totalIssues = commandLineResult.totalIssues;
        const resultText = commandLineResult.resultText();

        if (getBoolInput('generateLog')) {
            this.writeResult(commandLineResult.body, commandLineResult.totalIssues);
        }

        console.log(commandLineResult.body +
            commandLineResult.colorCode() +
            'Total Issues : ' + totalIssues);
        setResult(commandLineResult.compatibilityResult(), resultText);
    }

    private writeResult(body: string, issues: number): void {
        const fileName: string = this.validatePath('outputFilename');
        const directory: string = this.validatePath('outputFolder');
        const result: { issues: number; body: string } = {
            issues: issues,
            body: issues === 0 ? `No issues found in ${ getInput('contractsFileName') }` : body
        }

        if (!existsSync(directory)) {
            mkdirSync(directory, { recursive: true });
        }

        writeFileSync(`${join(directory, fileName)}`, JSON.stringify(result, null, 2) );
    }

    private validatePath(inputName: string): string {
        const path = getInput(inputName);

        if (!existsSync(path)) {
            throw new Error(`The file or directory "${ path }" specified in "${ inputName }" does not exist.`);
        }

        return path;
    }
}

new App().run();
