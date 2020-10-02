# Pull Request Preview Environments with AWS CDK and GitHub Actions

This Cloud Development Kit (CDK) application example deploys a preview environment for every pull-request, and destroys it when the pull-request is closed or merged.

GitHub Actions workflows are defined on: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) and [`.github/workflows/destroy.yml`](.github/workflows/destroy.yml)

### Other curiosities

- This project configured with [`projen`](https://github.com/eladb/projen)
- AWS resources declared with [`@aws-cdk-containers/ecs-service-extensions`](https://www.npmjs.com/package/@aws-cdk-containers/ecs-service-extensions) a new CDK Construct library for building ECS services
