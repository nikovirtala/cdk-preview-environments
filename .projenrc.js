const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.86.0',
  name: 'cdk-preview-environments',
  repository: 'https://github.com/nikovirtala/cdk-preview-environments.git',
  license: 'MIT',
  licenced: true,
  authorName: 'Niko Virtala',
  authorEmail: 'niko.virtala@hey.com',
  devDeps: ['prettier'],
  cdkDependencies: ['@aws-cdk/aws-ecs', '@aws-cdk-containers/ecs-service-extensions'],
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': 'true',
  },
  buildWorkflow: true,
  codeCov: false,
  jest: false,
  mergify: true,
  pullRequestTemplate: false,
  rebuildBot: true,
});

project.synth();
