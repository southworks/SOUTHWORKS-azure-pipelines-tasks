import { TaskMockRunner } from 'azure-pipelines-task-lib/mock-run';
import { join } from 'path';
import { readFileSync } from 'fs';
import { testConfiguration } from '../testConfigurationInterface';

const resolvePath = (filePath: string[]): string => {
    const root = [__dirname];
    return join.apply(null, root.concat(filePath));
}

export const runTest = (testName: string): void => {
    const tmr: TaskMockRunner = new TaskMockRunner(join(__dirname, '..', '..', 'src', 'index.js'));
    const content = readFileSync(join(__dirname, '..', '..', '..', 'tests', 'testCases', testName));
    const testConfig: testConfiguration = JSON.parse(content.toString());
    
    Object.keys(testConfig.inputs).forEach(input => {
        tmr.setInput(input, testConfig.inputs[input].toString());
    });

    const contract: string = resolvePath(testConfig.inputs.contractsRootFolder);
    const implementation: string = resolvePath(testConfig.inputs.implFolder);

    tmr.setInput('contractsRootFolder', contract);
    tmr.setInput('implFolder', implementation);

    if (testConfig.inputs.generateLog === true) {
        const outputFolder: string = resolvePath(testConfig.inputs.outputFolder);
        tmr.setInput('outputFolder', outputFolder);
    }

    if (testConfig.inputs.useBaseline === true) {
        const baselineFile: string = resolvePath(testConfig.inputs.baselineFile);
        console.log(baselineFile);
        tmr.setInput('baselineFile', baselineFile);
    }
    
    tmr.run();
}

