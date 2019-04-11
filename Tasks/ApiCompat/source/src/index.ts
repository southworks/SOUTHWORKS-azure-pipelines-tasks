import { join } from 'path'
import { getInput, setResult, TaskResult, getBoolInput } from 'azure-pipelines-task-lib';
import { execSync } from "child_process";
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import CommandLineResult from './commandLineResult';
import ApiCompatCommand from './apiCompatCommand';

const run = (): void => {
    try {
        // Create ApiCompat path
        const ApiCompatPath = join(__dirname, 'ApiCompat', 'Microsoft.DotNet.ApiCompat.exe');
        
        // Get the binaries to compare and create the command to run
        const inputFiles: string = getInputFiles();
        const apiCompatCommands: ApiCompatCommand = new ApiCompatCommand(ApiCompatPath, inputFiles);

        // Show the ApiCompat version
        console.log(execSync(apiCompatCommands.version).toString());

        // Run the ApiCompat command
        runCommand(apiCompatCommands.command);
    } catch (error) {
        setResult(TaskResult.Failed, error);
    }
}

const getInputFiles = (): string => {
    const filesName: string[] = [];

    getInput('contractsFileName').split(' ').forEach(file => {
        const fullFilePath: string = join(validatePath('contractsRootFolder'), file);
        if (existsSync(fullFilePath)) {
            filesName.push(fullFilePath);
        }
    });

    if (filesName.length == 0) {
        throw new Error('The specified contracts were not found.');
    }

    return filesName.join(',');
}

const runCommand = (command: string): void => {
    console.log(command);

    const result = execSync(command).toString();
    const commandLineResult = new CommandLineResult(result);
    const totalIssues = commandLineResult.totalIssues;
    const resultText = commandLineResult.resultText();

    if (getBoolInput('generateLog')) {
        writeResult(commandLineResult.body, commandLineResult.totalIssues);
    }

    console.log(commandLineResult.body +
        commandLineResult.colorCode() +
        'Total Issues : ' + totalIssues);
    setResult(commandLineResult.compatibilityResult(), resultText);
}

const writeResult = (body: string, issues: number): void => {
    const fileName: string = validatePath('outputFilename');
    const directory: string = validatePath('outputFolder');
    const result: any = {
        issues: issues,
        body: issues === 0 ? `No issues found in ${ getInput('contractsFileName') }` : body
    }
    
    if (!existsSync(directory)) {
        mkdirSync(directory, { recursive: true });
    }
    
    writeFileSync(`${join(directory, fileName)}`, JSON.stringify(result, null, 2) );
}

const validatePath = (inputName: string): string => {
    const path = getInput(inputName);
    
    if (!existsSync(path)) {
        throw new Error(`The file or directory "${ path }" specified in "${ inputName }" does not exist.`);
    }

    return path;
}

run();
