# Version Control

Development of public-facing diagrams should follow branch-based development following GitHub Flow (_[link](https://docs.github.com/en/get-started/using-github/github-flow)_).

Once the branch has been merged into `main`, a release of relevant file changes should be made.

## Tagging

Create a tag (_[link](https://git-scm.com/book/en/v2/Git-Basics-Tagging)_) following semantic versioning (_[link](https://semver.org/)_):

### Pre-release / Beta Calculator - < v1.0.0

A diagram that is still not ready for use in a public-facing calculator should be tagged with `v0.x.x`, where api breakages are not classed as MAJOR versions.

If the diagram is used in a public-facing but beta calculator [link](https://clearcalcs.com/support/faqs/what-is-a-beta-template), it may also be tagged with `v0.x.x`.

### 1. MAJOR `v.1.x.x`

When you make incompatible API changes. For example:

-   added/removed keys inside `params` or `storedParams` e.g. a new param to toggle visibility of elements.
-   modified expected types e.g 1D array param now expects 2D array
-   major user interaction modifications. e.g. click to select vs drag to select elements in diagram

### 2. MINOR `vX.1.X`

When you add functionality in a backward compatible manner. For example:

-   rendering improvements e.g. dimension lines are improved for clarity
-   minor user interaction improvements e.g. no major changes to UX flow required.

### 3. PATCH `vX.X.1`

When you make backward compatible bug fixes. For example:

-   bug fix (no additional rendering features)

### 4. Additional Labels `vX.X.X-alpha/beta/rc1`

Additional labels for pre-release and build metadata are available as optional extensions. Use sparingly for smaller projects.

-   Diagram used only in a `beta` template.

## GitHub Releases

Once a tag has been made, a new Release can be created against this tag with relevant compiled assets.

1. Parcel Cache may cause interactive diagram compiled html to not re-generate. Clear this via:

```bash
cd path/to/repository/folder
rm -rf .parcel-cache/
```

2. Generate compile assets

```bash
npm run compile-static
npm run compile-interactive
```

3. Create Release, see GitHub documentation (_[link](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)_)

    If only a static diagram or interactive diagram is updated, both assets should still be uploaded for compatibility.

4. Add release comments linking any relevant PRs.
