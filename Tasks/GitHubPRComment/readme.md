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

## Basic Example

We prepared a simple example using the task by creating a pull request from a branch containing a message example. When the PR is created, the Azure Pipelines build is triggered, and the GitHub PR Comment task picks up the plain text file from the PR branch and creates a message on the PR with its contents.

#### Azure Pipelines Setup

![PipelineSettings1](https://user-images.githubusercontent.com/42191764/56990659-09689680-6b6c-11e9-920f-522f77680923.png)

![PipelineSettings2](https://user-images.githubusercontent.com/42191764/56991005-03bf8080-6b6d-11e9-9ee8-a5dd6e136e75.png)

![PipelineSettings3](https://user-images.githubusercontent.com/42191764/56991007-0621da80-6b6d-11e9-8d50-875e68597125.png)

#### [Results](https://github.com/southworkscom/SOUTHWORKS-azure-pipelines-tasks/pull/12)

![PipelineResults](https://user-images.githubusercontent.com/42191764/56991010-07530780-6b6d-11e9-8e13-7bc79e83e4af.png)

