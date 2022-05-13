const { awscdk } = require('projen');

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.24.0',
  name: 'cdk-preview-environments',
  repository: 'https://github.com/nikovirtala/cdk-preview-environments.git',
  license: 'MIT',
  licenced: true,
  authorName: 'Niko Virtala',
  authorEmail: 'niko.virtala@hey.com',
  devDeps: ['prettier'],
  deps: ['@aws-cdk-containers/ecs-service-extensions@^2'],
  depsUpgradeOptions: {
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      secret: 'AUTOMATION_TOKEN',
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['nikovirtala'],
  },
  buildWorkflow: true,
  codeCov: false,
  eslint: true,
  eslintOptions: {
    prettier: true,
  },
  jest: false,
  mergify: true,
  pullRequestTemplate: false,
  rebuildBot: false,
  defaultReleaseBranch: 'main',
});

project.synth();
