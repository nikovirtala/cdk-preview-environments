import {
  Container,
  Environment,
  HttpLoadBalancerExtension,
  Service,
  ServiceDescription,
} from "@aws-cdk-containers/ecs-service-extensions";
import { App, Stack, aws_ecs } from "aws-cdk-lib";
import { Construct } from "constructs";

export class MyStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new Service(this, "service", {
      environment: new Environment(this, stage),
      serviceDescription: new ServiceDescription()
        .add(
          new Container({
            cpu: 256,
            memoryMiB: 512,
            trafficPort: 8080,
            image: aws_ecs.ContainerImage.fromRegistry("nikovirtala/honk"),
          })
        )
        .add(new HttpLoadBalancerExtension()),
    });
  }
}

const app = new App();

const stage = app.node.tryGetContext("stage") ?? "default";

new MyStack(app, "cdk-preview-environments-" + stage);

app.synth();
