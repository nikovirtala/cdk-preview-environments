# Pull Request Preview Environments with AWS CDK and GitHub Actions

This Cloud Development Kit (CDK) example project deploys a preview environment for every pull-request, and destroys it when the pull-request is closed or merged.

- Project configuration with [`projen`](https://github.com/eladb/projen)
- AWS resources declared with [`ecs-service-extensions`](https://www.npmjs.com/package/@aws-cdk-containers/ecs-service-extensions) construct
