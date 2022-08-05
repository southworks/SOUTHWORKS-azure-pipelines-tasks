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

<img width="1035" alt="PipelineSettings1" src="https://user-images.githubusercontent.com/64815358/182950828-130b4381-abaa-427c-a778-815b04dd1038.png">

<img width="1035" alt="PipelineSettings2" src="https://user-images.githubusercontent.com/64815358/182950852-f5ec3498-1e24-4a38-9112-74ed22a5a825.png">

<img width="1036" alt="PipelineSettings3" src="https://user-images.githubusercontent.com/64815358/182950859-85dc5e87-76e9-4014-8afb-83ddbc85c221.png">

<img width="1035" alt="PipelineSettings4" src="https://user-images.githubusercontent.com/64815358/182950868-db769da7-ea88-49e5-85bd-e49e621d7b4b.png">

#### Results

Keeping previous automatic comments.
![PipelineResults1](https://user-images.githubusercontent.com/64815358/182950943-09c32d51-7ffe-4fa4-b06b-218e795d7dcb.jpg)

Discarding previous automatic comments.
![PipelineResults2](https://user-images.githubusercontent.com/64815358/182950960-3a27e33e-74c6-426a-ba63-f59777b2e310.jpg)
