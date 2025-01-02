import { awscdk } from "projen";
import {
  DeploymentWorkflow,
  DestroyWorkflow,
  LintWorkflow,
} from "./src/workflows";

const project = new awscdk.AwsCdkTypeScriptApp({
  autoApproveOptions: {
    allowedUsernames: ["nikovirtala"],
    secret: "GITHUB_TOKEN",
  },
  authorEmail: "niko.virtala@hey.com",
  authorName: "Niko Virtala",
  buildWorkflow: true,
  cdkVersion: "2.173.4",
  codeCov: false,
  defaultReleaseBranch: "main",
  deps: ["@aws-cdk-containers/ecs-service-extensions@^2"],
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ["auto-approve", "auto-merge"],
    },
  },
  devDeps: ["prettier"],
  eslint: true,
  github: true,
  jest: false,
  license: "MIT",
  licensed: true,
  mergify: true,
  minNodeVersion: "22.12.0",
  name: "cdk-preview-environments",
  prettier: true,
  projenrcTs: true,
  pullRequestTemplate: false,
  repository: "https://github.com/nikovirtala/cdk-preview-environments.git",
  typescriptVersion: "5.7.2",
});

project.eslint?.addOverride({
  files: ["*"],
  rules: {
    "import/no-extraneous-dependencies": ["warn"],
  },
});

new DeploymentWorkflow(project);
new DestroyWorkflow(project);
new LintWorkflow(project);

project.synth();
