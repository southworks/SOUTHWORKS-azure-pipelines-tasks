import taskLibrary = require('azure-pipelines-task-lib/task');
import gitClient = require('@octokit/rest');
import path = require('path');
import fs = require('fs');

// We use HTML comments to hide the flagComment in the comment.
const flagComment = "<!-- DO NOT DELETE THIS COMMENT. -->";
const messageNotFound = "Message not found";

var userToken = taskLibrary.getInput("userToken");
var bodyFilePath = taskLibrary.getInput("bodyFilePath");
var extension = taskLibrary.getInput("extension");
var getSubFolders = taskLibrary.getBoolInput("getSubFolders");
var repository = taskLibrary.getInput("repository");
var keepCommentHistory = taskLibrary.getBoolInput("keepCommentHistory");
var prNumber = parseInt(taskLibrary.getInput('prNumber')!);

const clientWithAuth = new gitClient({
    auth: "token " + userToken,
    userAgent: "octokit/rest.js v1.2.3",
});

async function run() {
    if (message) {
        taskLibrary.debug(`[run] Creating comment...`);
        await clientWithAuth.issues
            .createComment(comment)
            .then((res) => {
                taskLibrary.debug(`[run] Comment created`);
                console.log(res);
                if (!keepCommentHistory) {
                    deleteComments();
                }
            })
            .catch((err) => {
                taskLibrary.setResult(taskLibrary.TaskResult.Failed, err);
            });
    }
    else {
        taskLibrary.setResult(taskLibrary.TaskResult.SucceededWithIssues, messageNotFound);
    }
}

const combineMessageBody = (files: string[]): string => {
    taskLibrary.debug(`[combineMessageBody] Merging files' content...`);
    var body: string = "";
    files.forEach((file) => {
        var bodyFile = fs.readFileSync(file);
        body += bodyFile + "\r\n";
    });
    taskLibrary.debug(`Message content: ${body}`);
    return body;
};

const iterateFilesFromDir = (
    filePath: string,
    extName: string,
    recursive: boolean,
    result: string[]
): string[] => {
    taskLibrary.debug(`Looking for extension ${extName} in ${filePath}`);
    var files = fs.readdirSync(filePath);
    taskLibrary.debug(`Files found in ${filePath}: ${files}`);
    files.forEach((file) => {
        var fileName = path.join(filePath, file);
        var isFolder = fs.lstatSync(fileName);
        if (recursive && isFolder.isDirectory()) {
            result = iterateFilesFromDir(fileName, extName, recursive, result);
        }

        if (path.extname(fileName) == extName) {
            result.push(fileName);
        }
    });

    return result;
};

const getFilesFromDir = (
    filePath: string,
    extName: string,
    recursive: boolean
): string[] => {
    if (!fs.existsSync(filePath)) {
        console.log(`File path does not exist: ${filePath}`);
        return [];
    }
    var result: string[] = [];
    var fileNames: string[] = [];
    iterateFilesFromDir(filePath, extName, recursive, result);
    result.forEach(element => {
        var fileName = path.basename(element);
        fileNames.push(fileName);
    });

    taskLibrary.debug(`[getFilesFromDir] Files with extension ${extName} found: ` + fileNames);

    return result;
};

var files = getFilesFromDir(
    bodyFilePath!,
    '.' + extension,
    getSubFolders
);

var message = combineMessageBody(files);

var [owner, repo] = repository!.split('/');

const comment: gitClient.IssuesCreateCommentParams = {
    owner,
    repo,
    number: prNumber!,
    body: "\r\n" + message + "\r\n" + flagComment,
};

const deleteComments = async () => {
    taskLibrary.debug(`[deleteComments] Running deleteComments method...`);
    await clientWithAuth.issues
        .listComments({ owner, repo, number: prNumber })
        .then((res) => {
            taskLibrary.debug(`[deleteComments] Listing elements...`);
            res.data.forEach(element => {
                taskLibrary.debug(`[deleteComments] Comment ID: ${element.id} Comment body: ${element.body}`);
            });
            taskLibrary.debug(`Comments found ${res.data.length}`);
            // We don't iterate the whole collection in order to not remove the last comment.
            for (let index = 0; index < res.data.length - 1; index++) {
                const element = res.data[index];
                if (element.body.indexOf(flagComment) != -1) {
                    taskLibrary.debug(`Deleting comment ${element.id} with body ${element.body}`);
                    clientWithAuth.issues.deleteComment({ owner, repo, comment_id: element.id });
                }
            }
        })
        .catch((err) => {
            taskLibrary.setResult(taskLibrary.TaskResult.Failed, err);
        });
};

run();
