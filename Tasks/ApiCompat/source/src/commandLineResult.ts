import { TaskResult, getBoolInput } from 'azure-pipelines-task-lib';

const red = '\x1b[31m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';

export class CommandLineResult {
    private failOnIssue: boolean = getBoolInput('failOnIssue');

    public readonly totalIssues: number;
    public readonly body: string;

    public constructor(result: string) {
        const indexOfTotalIssues = result.indexOf('Total Issues');

        this.totalIssues = this.getTotalIssues(result, indexOfTotalIssues);
        this.body = this.getBody(result, indexOfTotalIssues);
    }

    private getTotalIssues(message: string, indexOfTotalIssues: number): number {
        return parseInt(message.substring(indexOfTotalIssues).split(':')[1].trim(), 10);
    }

    private getBody(message: string, indexOfTotalIssues: number): string {
        return message.substring(0, indexOfTotalIssues - 1);
    }

    public resultText(): string {
        return this.totalIssues ?
            'There were differences between the assemblies':
            'No differences were found between the assemblies';
    }

    public compatibilityResult(): TaskResult {
        if (this.totalIssues === 0) {
            return TaskResult.Succeeded;
        }

        if (this.failOnIssue) {
            return TaskResult.Failed;
        }

        return TaskResult.SucceededWithIssues;
    }

    public colorCode(): string {
        if (this.totalIssues === 0) {
            return green;
        }

        if (this.failOnIssue) {
            return red;
        }

        return yellow;
    }
}
