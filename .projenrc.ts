import { awscdk } from "projen";
import { DeploymentWorkflow, DestroyWorkflow } from "./src/workflows";

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: "2.173.4",
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
  typescriptVersion: "5.7.2",
  projenrcTs: true,
  minNodeVersion: "22.12.0",
  github: true,
});

project.eslint?.addOverride({
  files: ["*"],
  rules: {
    "import/no-extraneous-dependencies": ["warn"],
  },
});

new DeploymentWorkflow(project);
new DestroyWorkflow(project);

project.synth();
