// Semantic Release configuration file
// https://semantic-release.gitbook.io/semantic-release/usage/configuration
module.exports = {
  branches: 'main',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github',
    'semantic-release-vsce',
  ],
};
