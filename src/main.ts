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

    const serviceDescription = new ServiceDescription();
    serviceDescription.add(
      new Container({
        cpu: 256,
        memoryMiB: 512,
        trafficPort: 8080,
        image: ContainerImage.fromRegistry('nikovirtala/honk'),
      }),
    );
    serviceDescription.add(new HttpLoadBalancerExtension());

    new Service(this, 'service', {
      environment: environment,
      serviceDescription: serviceDescription,
    });
  }
}

const app = new App();
const stage = app.node.tryGetContext('stage') || 'default';
new MyStack(app, 'cdk-preview-environments-' + stage);
app.synth();
