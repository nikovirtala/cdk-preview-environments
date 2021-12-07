const { awscdk } = require('projen');

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '1.134.0',
  name: 'cdk-preview-environments',
  repository: 'https://github.com/nikovirtala/cdk-preview-environments.git',
  license: 'MIT',
  licenced: true,
  authorName: 'Niko Virtala',
  authorEmail: 'niko.virtala@hey.com',
  devDeps: ['prettier'],
  cdkDependencies: ['@aws-cdk/aws-ecs', '@aws-cdk-containers/ecs-service-extensions'],
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
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': 'true',
    'aws-cdk:enableDiffNoFail': 'true',
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
