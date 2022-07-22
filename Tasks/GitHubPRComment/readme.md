# GitHub PR Comment Task

This task has the functionality to receive plain text files and use the content to create a GitHub comment on a Pull Request.



## How to configure it

**User Token**

[GitHub Personal Access Token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line) (it must have *Repo* permissions).

**Repository**

RepositoryOwner/Repository name. Use  `$(Build.Repository.Name)` if you want to run on the build's repository.

**Pull Request Number**

Number of the pull request you want to comment. Use `$(System.PullRequest.PullRequestNumber)` if you want to run on the build's PR.

**Path to the file/s**

Path to the file/s that you want to get the PR comments from. If you specify a folder, it will pick all the files that have the specified extension inside that folder

**Use sub-folders**

Checking this option will enable to search for all the files of the specified extensions in all the folders and sub-folders contained in the previously selected path

**Keep Comment History**

Checking this option will keep the previous automatic comments. Otherwise, will keep the last automatic comment only. 

## Basic Example

We prepared a simple example using the task by creating a pull request from a branch containing a message example. When the PR is created, the Azure Pipelines build is triggered, and the GitHub PR Comment task picks up the plain text file from the PR branch and creates a message on the PR with its contents.
Additionally, we tested the same example by turning off the Keep Comment History flag.

#### Azure Pipelines Setup

![PipelineSettings1](https://github.com/southworks/SOUTHWORKS-azure-pipelines-tasks/blob/0efd43ea9a60ff7a8e236b96e36202070e35af8d/Tasks/GitHubPRComment/images/BasicGuide/PipelineSettings1.png)

![PipelineSettings2](https://github.com/southworks/SOUTHWORKS-azure-pipelines-tasks/blob/0efd43ea9a60ff7a8e236b96e36202070e35af8d/Tasks/GitHubPRComment/images/BasicGuide/PipelineSettings2.png)

![PipelineSettings3](https://github.com/southworks/SOUTHWORKS-azure-pipelines-tasks/blob/0efd43ea9a60ff7a8e236b96e36202070e35af8d/Tasks/GitHubPRComment/images/BasicGuide/PipelineSettings3.png)

![PipelineSettings4](https://github.com/southworks/SOUTHWORKS-azure-pipelines-tasks/blob/0efd43ea9a60ff7a8e236b96e36202070e35af8d/Tasks/GitHubPRComment/images/BasicGuide/PipelineSettings4.png)

#### Results

Keeping previous automatic comments.
![PipelineResults1](https://github.com/southworks/SOUTHWORKS-azure-pipelines-tasks/blob/0efd43ea9a60ff7a8e236b96e36202070e35af8d/Tasks/GitHubPRComment/images/BasicGuide/PipelineResults1.jpg)

Discarding previous automatic comments.
![PipelineResults2](https://github.com/southworks/SOUTHWORKS-azure-pipelines-tasks/blob/0efd43ea9a60ff7a8e236b96e36202070e35af8d/Tasks/GitHubPRComment/images/BasicGuide/PipelineResults2.jpg)


