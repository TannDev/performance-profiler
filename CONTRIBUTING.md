# Contributing to Performance Profiler

## Reporting Bugs and Requesting Features
To report a bug or request an new feature, please [open an issue](https://github.com/Tanndev/performance-profiler/issues).

## Contributing Code
All code must undergo code review before it can be merged in. To enable this, contributors must open a pull request. A code owner will review the PR and either approve it, ask questions, or request changes. Once all requested changes have been made, and the PR is approved, it may be merged in.

### Commit Conventions
This repo uses the [Angular commit convention](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commit-message-format). All commits should have the following format:
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
```

No line should be longer than 100 characters.

#### Type
The following items may be used for the **required** type element:
- **feat:** A new feature
- **fix:** A bug fix
- **docs:** Documentation only changes
- **style:** Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor:** A code change that neither fixes a bug nor adds a feature
- **perf:** A code change that improves performance
- **test:** Adding missing or correcting existing tests
- **chore:** Changes to the build process or auxiliary tools and libraries such as documentation generation

#### Scope
The _optional_ scope element can be anything which describes where the change occurred. See previous commits for examples of what scopes to are generally used.

#### Subject
The **required** subject element should very briefly describe the change.

Follow the following rules:
- Use the imperative, present tense: "change" instead of "changed" or "changes"
- Don't capitalize first letter
- Don't end with a dot (`.`)

#### Body
The _optional_ body element should describe the change in more detail. As with subject, be sure to use the imperative, present tense. It's useful to explain why the change was made and how it differs from the previous behavior.

## Release and Publish
When changes are merged to the `master` branch, semantic-release will automatically determine a new version number, generate release notes, and create a new release. This is done automatically and no additional interaction is required.
