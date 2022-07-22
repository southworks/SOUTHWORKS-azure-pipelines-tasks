import taskLibrary = require('azure-pipelines-task-lib/task');
import gitClient = require('@octokit/rest');
import path = require('path');
import fs = require('fs');

// We use HTML comments to hide the flagComment in the comment.
const flagComment = "<!-- DO NOT DELETE THIS COMMENT. -->";
const messageNotFound = "Message not found";

const getFilesFromDir = (
    filePath: string,
    extName: string,
    recursive: boolean
): string[] => {
    if (!fs.existsSync(filePath)) {
        console.log("File path does not exist: ", filePath);
        return [];
    }
    var result: string[] = [];
    iterateFilesFromDir(filePath, extName, recursive, result);

    return result;
};

const iterateFilesFromDir = (
    filePath: string,
    extName: string,
    recursive: boolean,
    result: string[]
): string[] => {
    var files = fs.readdirSync(filePath);
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

const combineMessageBody = (files: string[]): string => {
    var body: string = "";
    files.forEach((file) => {
        var bodyFile = fs.readFileSync(file);
        body += bodyFile + "\r\n";
    });
    return body;
};

/*
 * Deletes previous automatically generated comments that contain the comment flag.
 */
const deleteComments = async () => {
    await clientWithAuth.issues
        .listCommentsForRepo(listCommentParams)
        .then((res) => {
            // We don't iterate the whole collection in order to not remove the last comment.
            for (let index = 0; index < res.data.length - 1; index++) {
                const element = res.data[index];
                if (element.body.indexOf(flagComment) != -1) {
                    deleteCommentParams.comment_id = element.id;
                    clientWithAuth.issues.deleteComment(deleteCommentParams);
                }
            }
        })
        .catch((err) => {
            taskLibrary.setResult(taskLibrary.TaskResult.Failed, err);
        });
};

const clientWithAuth = new gitClient({
    auth: "token " + taskLibrary.getInput("userToken"),
    userAgent: "octokit/rest.js v1.2.3",
});

var files = getFilesFromDir(
    taskLibrary.getInput("bodyFilePath")!, '.' + taskLibrary.getInput('extension'),
    taskLibrary.getBoolInput("getSubFolders")
);
var message = combineMessageBody(files);
var repo = taskLibrary.getInput('repository')!.split('/');
var keepCommentHistory = taskLibrary.getBoolInput("keepCommentHistory");

const comment: gitClient.IssuesCreateCommentParams = {
    owner: repo[0],
    repo: repo[1],
    number: parseInt(taskLibrary.getInput('prNumber')!),
    body: "\r\n" + message + "\r\n" + flagComment,
};

const listCommentParams: gitClient.IssuesListCommentsForRepoParams = {
    owner: repo[0],
    repo: repo[1],
};

const deleteCommentParams: gitClient.IssuesDeleteCommentParams = {
    owner: repo[0],
    repo: repo[1],
    comment_id: 0,
};

async function run() {
    if (message) {
        await clientWithAuth.issues
            .createComment(comment)
            .then((res) => {
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

run();
