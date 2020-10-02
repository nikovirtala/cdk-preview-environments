import {
  Container,
  Environment,
  HttpLoadBalancerExtension,
  Service,
  ServiceDescription,
} from '@aws-cdk-containers/ecs-service-extensions';
import { ContainerImage } from '@aws-cdk/aws-ecs';
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // define resources here...
    const environment = new Environment(this, stage);

    const nameDescription = new ServiceDescription();
    nameDescription.add(
      new Container({
        cpu: 256,
        memoryMiB: 512,
        trafficPort: 80,
        image: ContainerImage.fromRegistry('nathanpeck/name'),
        environment: {
          PORT: '80',
        },
      }),
    );
    nameDescription.add(new HttpLoadBalancerExtension());

    new Service(this, 'name', {
      environment: environment,
      serviceDescription: nameDescription,
    });
  }
}

const app = new App();
const stage = app.node.tryGetContext('stage') || 'default';
new MyStack(app, 'cdk-preview-environments-' + stage);
app.synth();
