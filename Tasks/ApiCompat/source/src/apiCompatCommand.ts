import { getInput, getBoolInput } from 'azure-pipelines-task-lib';
import { existsSync } from 'fs';

export class ApiCompatCommand {
    public readonly command: string;
    public readonly version: string;

    public constructor(apiCompatPath: string, inputFiles: string) {
        this.command = this.mandatoryParameters(apiCompatPath, inputFiles) + this.optionalParameters();
        this.version = `"${apiCompatPath}" --version`;
    }

    private mandatoryParameters(apiCompatPath: string, inputFiles: string): string {
        return `"${apiCompatPath}" "${inputFiles}" --impl-dirs "${ this.validatePath('implFolder')}"`
    }

    private optionalParameters(): string {
        let command: string;

        command = getInput('resolveFx') === 'true' ? ' --resolve-fx' : '';
        command += getInput('warnOnIncorrectVersion') === 'true' ? ' --warn-on-incorrect-version' : '';
        command += getInput('warnOnMissingAssemblies') === 'true' ? ' --warn-on-missing-assemblies' : '';
        command += getBoolInput('useBaseline') ? ` --baseline "${ this.validatePath('baselineFile') }"` : '';

        return command;
    }

    private validatePath(inputName: string): string {
        const path = getInput(inputName);

        if (!existsSync(path)) {
            throw new Error(`The file or directory "${ path }" specified in "${ inputName }" does not exist.`);
        }

        return path;
    }
}
