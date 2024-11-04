import { awscdk } from "projen";

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: "2.158.0",
  name: "cdk-preview-environments",
  repository: "https://github.com/nikovirtala/cdk-preview-environments.git",
  license: "MIT",
  licensed: true,
  authorName: "Niko Virtala",
  authorEmail: "niko.virtala@hey.com",
  devDeps: ["prettier"],
  deps: ["@aws-cdk-containers/ecs-service-extensions@^2"],
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ["auto-approve", "auto-merge"],
    },
  },
  autoApproveOptions: {
    secret: "GITHUB_TOKEN",
    allowedUsernames: ["nikovirtala"],
  },
  buildWorkflow: true,
  codeCov: false,
  eslint: true,
  prettier: true,
  jest: false,
  mergify: true,
  pullRequestTemplate: false,
  defaultReleaseBranch: "main",
  typescriptVersion: "5.5.4",
  projenrcTs: true,
  minNodeVersion: "18.18.0",
});

project.synth();
