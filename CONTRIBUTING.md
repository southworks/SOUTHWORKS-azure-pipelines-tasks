# Contributing

Thank you for reading the contributing guidelines of the project. It will help you make great contributions like reporting issues, creating feature requests, and submitting pull requests.

## Issues, Feature Request & Questions

Before submitting **issues**, **feature requests**, or **questions**, please do a quick search in [Open Issues](https://github.com/southworks/SOUTHWORKS-azure-pipelines-tasks/issues?q=is%3Aissue+is%3Aopen) to verify if it was already created. If there is an existing issue, please feel free to leave a comment. 

### Writing Great Issues & Feature Requests

- Provide reproducible steps, what the result of the steps was, and what you expected to happen.
- Avoid listing multiple bugs or requests in the same issue. Always write a single bug or feature request per issue. 
- Avoid adding your issue as a comment to an existing one unless it's for the exact input. Issues can look similar, but have different causes.
- Add screenshots or animated GIFs.

### Submitting Issues 

1. Go to the [Issues](https://github.com/southworks/SOUTHWORKS-azure-pipelines-tasks/issues) page, click on [New issue](https://github.com/southworks/SOUTHWORKS-azure-pipelines-tasks/issues/new/choose).
2. Select a **template**. Choose the one that fits your case. 
   1. Bug Report
   2. Documentation Bug
   3. Feature request
   4. Question
3. Fill the issue template. Remember to follow the best practices to write Issues and Feature requests.

### Branching Model

- **Main**: Accepts merges from Features/Issues and Hotfixes
- **Features/Issues**: Always branch off from Main
  
  - Prefix: action/* e.g.: `add/new-task`, `fix/api-compat/validation-issue`
    
  >  Actions available: `add`, `update`, `fix`, and `remove`
  
- **Hotfix**: Always branch off from Main
  
  - Prefix: hotfix/* e.g.: `hotfix/remove-duplicate-load-data`

### Submit contribution

Pull Requests are a great way to keep track of tasks, enhancements, and bugs for projects. When we are writing them, we must think about, how the rest of the team is going to read it? What kind of information we will place in it to make it easy to read and understand their changes?. Follow these practices to help you to write great pull requests.

#### Writing great pull requests

- Choose a descriptive title and add the context of the changes using square brackets. 
  - e.g.: `[ApiCompat] Add a method`, `[GitHubPRComment] Add new comment format`
- If the pull request fixes an issue:
  - Use the issue's title as a name. 
    -  e.g.: ISSUE #03: `Pull Request Commenter triggers twice` ---> PR Title: `[ISSUE#03] Pull Request Commenter triggers twice`
  - Add the number of the related issue at the beginning, following the pull request template.
    -  e.g.: `Fixes #03` 
- Provide all the information about the changes made in the pull request.
- Add screenshots or animated GIFs.
