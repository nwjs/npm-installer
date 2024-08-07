# Contributing

## External contributor

- We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) style of commit messages.
- On opening a new PR, the comments will guide you on how to construct the new PR.
- Pull requests are squashed and merged onto the `main` branch.
- PR title is used as commit's first line, PR description is used as commit body.
- Add tests whenever possible.

## Maintainer guidelines

- Approve pull requests before merging.
- Enforce conventional commits before merging pull requests.
- A commit's first line should be formatted as `<type>[optional scope]: <description>`.
- A commit's body should have a description of changes in bullet points followed by any links it references or issues it fixes or closes.
- NPM Publish Action publishes to `npm` if there is a version bump.