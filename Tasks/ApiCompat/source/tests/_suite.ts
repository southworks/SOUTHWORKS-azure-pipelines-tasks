import { extname, join } from 'path';
import { equal, deepEqual} from 'assert';
import { MockTestRunner } from 'azure-pipelines-task-lib/mock-test';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { testConfiguration } from './testConfigurationInterface';

describe('ApiCompat Azure Pipeline Task', function (): void {
    const root: string = join(__dirname, '..', '..', 'tests', 'testCases');
    let result = '';
    let count = 0;

    afterEach(() => {
        if (this.tests[count].isFailed()) {
            console.log(result);
        }
        count++;
    });

    const runTest = (testName: string, testConfig: testConfiguration, testFileName: string) => {
        it(testName, function(done: MochaDone): void {
            this.timeout(testConfig.timeout);

            const tp = join(__dirname, 'testCases', testFileName.slice(0, -4) + 'js');
            equal(existsSync(tp), true, 'test file was not found');
            const tr: MockTestRunner = new MockTestRunner(tp);

            tr.run();
            result = tr.stdout;

            const shouldSucceed: boolean = testConfig.expected.succeeded
            const expectedWarnings: string[] = testConfig.expected.warningIssues;
            const expectedErrors: string[] = testConfig.expected.errorIssues;
            
            equal(tr.succeeded, shouldSucceed, `should have ${ shouldSucceed ? 'succeed' : 'failed' }`);
            deepEqual(tr.warningIssues, expectedWarnings, 'task warnings should match');
            deepEqual(tr.errorIssues, expectedErrors, 'task errors should match');

            done();
        });
    }

    readdirSync(root).forEach(file => {
        if (extname(file) === '.json') {
            const content = readFileSync(join(root, file), 'utf8');
            const unitTest: testConfiguration = JSON.parse(content);
            
            runTest(unitTest.description, unitTest, file);
        }
    });
});

