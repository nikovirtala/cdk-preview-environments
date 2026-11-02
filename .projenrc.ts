import { AwsCdkTypeScriptAppProject } from "@nikovirtala/projen-constructs";
import { DeploymentWorkflow, DestroyWorkflow, LintWorkflow } from "./src/workflows.ts";

const project = new AwsCdkTypeScriptAppProject({
    authorEmail: "niko.virtala@hey.com",
    authorName: "Niko Virtala",
    cdkVersion: "2.173.4",
    defaultReleaseBranch: "main",
    deps: ["@aws-cdk-containers/ecs-service-extensions@^2"],
    devDeps: ["@nikovirtala/projen-constructs"],
    license: "MIT",
    licensed: true,
    name: "cdk-preview-environments",
    pullRequestTemplate: false,
    repository: "https://github.com/nikovirtala/cdk-preview-environments.git",
});

new DeploymentWorkflow(project);
new DestroyWorkflow(project);
new LintWorkflow(project);

project.synth();
