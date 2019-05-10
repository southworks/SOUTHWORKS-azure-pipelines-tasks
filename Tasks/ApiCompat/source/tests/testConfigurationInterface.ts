export interface testConfiguration {
    description: string;
    timeout: number;
    inputs: {
        [key: string]: string | string[] | boolean;
        contractsRootFolder: string[];
        contractsFileName: string;
        implFolder: string[];
        failOnIssue: boolean;
        resolveFx: boolean;
        warnOnIncorrectVersion: boolean;
        warnOnMissingAssemblies: boolean;
        generateLog: boolean;
        outputFilename: string;
        outputFolder: string[];
        useBaseline: boolean;
        baselineFile: string[];
    }
    expected: {
        succeeded: boolean;
        warningIssues: string[];
        errorIssues: string[];
    }
}

