const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.68.0',
  name: 'cdk-preview-environments',
  repository: 'https://github.com/nikovirtala/cdk-preview-environments.git',
  license: 'MIT',
  authorName: 'Niko Virtala',
  authorEmail: 'niko.virtala@hey.com',
  dependencies: {
    prettier: '^2.1.2',
  },
  cdkDependencies: ['@aws-cdk/aws-ecs', '@aws-cdk-containers/ecs-service-extensions'],
});

project.synth();
