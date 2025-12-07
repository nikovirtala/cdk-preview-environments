# Project Structure

## Directory Layout

```
.
├── src/                    # Source code
│   ├── main.ts            # CDK app entry point and stack definition
│   └── workflows.ts       # GitHub Actions workflow definitions
├── .github/workflows/     # Generated GitHub Actions workflows
├── .projen/               # Projen metadata (generated)
├── cdk.out/               # CDK synthesis output (generated)
├── lib/                   # Compiled TypeScript output (generated)
├── node_modules/          # Dependencies
├── .projenrc.ts           # Projen configuration (source of truth)
├── cdk.json               # CDK app configuration
├── package.json           # NPM package definition
└── tsconfig.json          # TypeScript configuration
```

## Key Files

### Source Code

- **src/main.ts** - Defines the CDK stack and application. Contains the ECS service configuration using service extensions pattern.
- **src/workflows.ts** - Defines GitHub Actions workflows as Projen components (DeploymentWorkflow, DestroyWorkflow, LintWorkflow).

### Configuration

- **.projenrc.ts** - Single source of truth for project configuration. Modify this file and run `npx projen` to update generated files.
- **cdk.json** - CDK app configuration. Specifies the app entry point and synthesis settings.

## Architecture Patterns

### CDK Stack Organization

- Single stack per stage (environment)
- Stack naming: `cdk-preview-environments-{stage}`
- Stage determined by CDK context: `--context stage=<value>`

### ECS Service Pattern

Uses `@aws-cdk-containers/ecs-service-extensions` for declarative service definition:
- ServiceDescription with Container and HttpLoadBalancerExtension
- Environment construct manages VPC and cluster
- Container configuration: 256 CPU, 512 MB memory, port 8080

### Workflow Organization

GitHub Actions workflows are defined as Projen components in `src/workflows.ts`:
- **DeploymentWorkflow** - Triggers on PR open/update
- **DestroyWorkflow** - Triggers on PR close
- **LintWorkflow** - Runs CloudFormation linting on PRs

## Conventions

- All AWS resources deployed in `eu-west-1` region
- Stage naming: `prod` for main branch, `pr-{number}` for pull requests
- Use Yarn with `--frozen-lockfile` for reproducible installs
- GitHub Deployments API integration for deployment tracking
