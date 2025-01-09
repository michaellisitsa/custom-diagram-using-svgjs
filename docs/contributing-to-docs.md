# Contributing to Docs

## Setting up Locally

### Global install

1. Go to Project folder

```
    cd path/to/repository/folder
```

2. Install docsify globally [link](https://docsify.js.org/#/quickstart?id=quick-start). This is required for `npm run docs` to work.

```
    npm i docsify-cli -g
```

3. Launch docs

```
    npm run docs
```

4. Updated docs and see your changes added.

### Using npx

Where install docsify globally is not desired, you can also run the docs as following

1. Go to docs directory

```
    cd docs
```

2. Install dependencies

```
    npm install
```

3. Launch docs

```
    npx docsify serve -p 4444
```

## Forking and PRing

1. Clone [repository](https://github.com/ClearCalcs/custom-diagram-boilerplate) or pull latest changes from `main` branch.

2. Follow "Fork and Pull Request" workflow per [GitHub: Contributing to a Project](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project)

3. Add description to PR. Recommended format:

```
[Add] - Docs: Your feature description
```

4. Once changes are merged they will automatically be deployed to [GitHub Pages](https://github.com/ClearCalcs/custom-diagram-boilerplate/deployments/github-pages)

## Guide

A general guide for how to structure your docs:

### Adding New File

1. Add a markdown file under the [/docs](https://github.com/ClearCalcs/custom-diagram-boilerplate/tree/main/docs) directory.
2. Add link to file in [\_sidebar.md](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/docs/_sidebar.md)

### Tips & Tricks

-   Updates to `/docs/README.md` will be shown on the homepage.
-   Use General Info Box https://docsify.js.org/#/helpers?id=general-tips for emphasizing information
-   Use code blocks for any code the user might need to copy and/or where syntax highlighting is preferred.
