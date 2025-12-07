# Product Overview

This is a CDK application that demonstrates pull request preview environments using AWS CDK and GitHub Actions.

## Core Functionality

- Automatically deploys a preview environment for each pull request
- Destroys the environment when the PR is closed or merged
- Uses ECS with Application Load Balancer for hosting containerized applications
- Integrates with GitHub Deployments API for tracking deployment status

## Key Features

- Stage-based deployments (prod for main branch, pr-{number} for pull requests)
- Automated deployment and teardown via GitHub Actions workflows
- CloudFormation linting in CI pipeline
