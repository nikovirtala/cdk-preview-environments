import {
  Container,
  Environment,
  HttpLoadBalancerExtension,
  Service,
  ServiceDescription,
} from "@aws-cdk-containers/ecs-service-extensions";
import { App, Stack } from "aws-cdk-lib";
import { ContainerImage } from "aws-cdk-lib/aws-ecs";
import { Construct } from "constructs";

export class MyStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const environment = new Environment(this, stage);

    const serviceDescription = new ServiceDescription();
    serviceDescription.add(
      new Container({
        cpu: 256,
        memoryMiB: 512,
        trafficPort: 8080,
        image: ContainerImage.fromRegistry("nikovirtala/honk"),
      })
    );
    serviceDescription.add(new HttpLoadBalancerExtension());

    new Service(this, "service", {
      environment: environment,
      serviceDescription: serviceDescription,
    });
  }
}

const app = new App();
const stage = app.node.tryGetContext("stage") || "default";
new MyStack(app, "cdk-preview-environments-" + stage);
app.synth();
