const COMMIT_ANALYZER = '@semantic-release/commit-analyzer';

const RELEASE_NOTES_GENERATOR = '@semantic-release/release-notes-generator';

const NPM = '@semantic-release/npm';

const GITHUB = [
    '@semantic-release/github',
    {
        successComment: "This ${issue.pull_request ? 'pull request is included' : 'issue is fixed'} in version ${nextRelease.version}",
        failTitle: 'CI: The automatic release failed',
        labels: ['release pipeline']
    }
];


module.exports = {
    branch: 'master',
    repositoryUrl: 'https://github.com/Tanndev/performance-profiler.git',
    plugins: [
        COMMIT_ANALYZER,
        RELEASE_NOTES_GENERATOR,
        NPM,
        GITHUB
    ]
};
