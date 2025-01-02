import { awscdk, Component } from "projen";
import { GithubWorkflow } from "projen/lib/github";
import { JobPermission } from "projen/lib/github/workflows-model";

export class DeploymentWorkflow extends Component {
  constructor(project: awscdk.AwsCdkTypeScriptApp) {
    super(project);

    if (!project.github) {
      throw new Error("the project must have GitHub enabled!");
    }

    const deployWorkflow = new GithubWorkflow(project.github, "deploy");

    deployWorkflow.on({
      pullRequest: {
        branches: ["main"],
      },
    });

    deployWorkflow.addJob("deploy", {
      runsOn: ["ubuntu-latest"],
      permissions: {
        contents: JobPermission.READ,
        deployments: JobPermission.WRITE,
        idToken: JobPermission.WRITE,
      },
      steps: [
        {
          name: "Checkout",
          uses: "actions/checkout@v4",
        },
        {
          name: "Setup Node.js",
          uses: "actions/setup-node@v4",
          with: {
            "node-version": project.minNodeVersion,
          },
        },
        {
          name: "Configure AWS credentials",
          uses: "aws-actions/configure-aws-credentials@v4",
          with: {
            "aws-region": "eu-west-1",
            "role-to-assume": "${{ secrets.AWS_ROLE_TO_ASSUME }}",
            "role-session-name": "github-actions-session",
          },
        },
        {
          name: "Install Dependencies",
          run: "yarn --frozen-lockfile",
        },
        {
          name: "Set CDK Application Stage",
          id: "stage",
          run: [
            'if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then',
            '  echo ::set-output name=stage::"prod"',
            "else",
            '  echo ::set-output name=stage::"pr-${{ github.event.number }}"',
            "fi",
          ].join("\n"),
        },
        {
          name: "Create GitHub Deployment",
          id: "deployment",
          uses: "bobheadxi/deployments@v1",
          with: {
            step: "start",
            token: "${{ secrets.GITHUB_TOKEN }}",
            env: "${{ steps.stage.outputs.stage }}",
            ref: "${{ github.head_ref }}",
          },
        },
        {
          name: "Diff?",
          run: "npx cdk diff --context stage=${{ steps.stage.outputs.stage }}",
        },
        {
          name: "Deploy!",
          id: "deploy",
          run: [
            "npx projen deploy \\",
            "  --require-approval never \\",
            "  --outputs-file outputs.json \\",
            "  --context stage=${{ steps.stage.outputs.stage }} &&",
            `echo ::set-output name=env_url::"http://$(jq -r '.[] | select(.serviceloadbalancerdnsoutput).serviceloadbalancerdnsoutput' outputs.json)"`,
          ].join("\n"),
        },
        {
          name: "Update GitHub Deployment Status",
          uses: "bobheadxi/deployments@v1",
          if: "always()",
          with: {
            step: "finish",
            token: "${{ secrets.GITHUB_TOKEN }}",
            status: "${{ job.status }}",
            env: "${{ steps.stage.outputs.stage }}",
            deployment_id: "${{ steps.deployment.outputs.deployment_id }}",
            env_url: "${{ steps.deploy.outputs.env_url }}",
          },
        },
      ],
    });
  }
}

export class DestroyWorkflow extends Component {
  constructor(project: awscdk.AwsCdkTypeScriptApp) {
    super(project);

    if (!project.github) {
      throw new Error("the project must have GitHub enabled!");
    }

    const destroyWorkflow = new GithubWorkflow(project.github, "destroy");

    destroyWorkflow.on({
      pullRequest: {
        branches: ["main"],
        types: ["closed"],
      },
    });

    destroyWorkflow.addJob("destroy", {
      runsOn: ["ubuntu-latest"],
      permissions: {
        contents: JobPermission.READ,
        deployments: JobPermission.WRITE,
        idToken: JobPermission.WRITE,
      },
      steps: [
        {
          name: "Checkout",
          uses: "actions/checkout@v4",
        },
        {
          name: "Setup Node.js",
          uses: "actions/setup-node@v4",
          with: {
            "node-version": project.minNodeVersion,
          },
        },
        {
          name: "Configure AWS credentials",
          uses: "aws-actions/configure-aws-credentials@v4",
          with: {
            "aws-region": "eu-west-1",
            "role-to-assume": "${{ secrets.AWS_ROLE_TO_ASSUME }}",
            "role-session-name": "github-actions-session",
          },
        },
        {
          name: "Install Dependencies",
          run: "yarn --frozen-lockfile",
        },
        {
          name: "Set CDK Application Stage",
          id: "stage",
          run: [
            'echo ::set-output name=stage::"pr-${{ github.event.number }}"',
          ].join("\n"),
        },
        {
          name: "Destroy",
          run: [
            "npx projen destroy \\",
            "  --context stage=${{ steps.stage.outputs.stage }} \\",
            "  --force",
          ].join("\n"),
        },
        {
          name: "Deactivate GitHub Deployment",
          uses: "bobheadxi/deployments@v1",
          with: {
            step: "deactivate-env",
            token: "${{ secrets.GITHUB_TOKEN }}",
            env: "${{ steps.stage.outputs.stage }}",
            desc: "environment deactivated after destroy",
          },
        },
      ],
    });
  }
}

export class LintWorkflow extends Component {
  constructor(project: awscdk.AwsCdkTypeScriptApp) {
    super(project);

    if (!project.github) {
      throw new Error("the project must have GitHub enabled!");
    }

    const lintWorkflow = new GithubWorkflow(project.github, "lint");

    lintWorkflow.on({
      pullRequest: {
        branches: ["main"],
      },
    });

    lintWorkflow.addJob("lint", {
      runsOn: ["ubuntu-latest"],
      permissions: {
        contents: JobPermission.READ,
      },
      steps: [
        {
          name: "Checkout",
          uses: "actions/checkout@v4",
        },
        {
          name: "Setup Node.js",
          uses: "actions/setup-node@v4",
          with: {
            "node-version": project.minNodeVersion,
          },
        },
        {
          name: "Install Dependencies",
          run: "yarn --frozen-lockfile",
        },
        {
          name: "Set CDK Application Stage",
          id: "stage",
          run: [
            'if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then',
            '  echo ::set-output name=stage::"prod"',
            "else",
            '  echo ::set-output name=stage::"pr-${{ github.event.number }}"',
            "fi",
          ].join("\n"),
        },
        {
          name: "Synth",
          run: "npx cdk synth --context stage=${{ steps.stage.outputs.stage }}",
        },
        {
          name: "Lint",
          uses: "docker://ghcr.io/scottbrenner/cfn-lint-action:master",
          with: {
            args: "-t cdk.out/**template.json -i E3002,E3003,W3005",
          },
        },
      ],
    });
  }
}
