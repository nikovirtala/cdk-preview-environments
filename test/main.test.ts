import { App } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { beforeAll, describe, test } from "vitest";
import { MyStack } from "../src/main.ts";

describe("MyStack", () => {
    let template: Template;

    beforeAll(() => {
        template = Template.fromStack(new MyStack(new App(), "test"));
    });

    test("runs the honk image on Fargate with 256 CPU and 512 MB", () => {
        template.resourceCountIs("AWS::ECS::Service", 1);
        template.hasResourceProperties("AWS::ECS::TaskDefinition", {
            Cpu: "256",
            Memory: "512",
            RequiresCompatibilities: ["EC2", "FARGATE"],
            ContainerDefinitions: Match.arrayWith([
                Match.objectLike({
                    Image: "nikovirtala/honk",
                    PortMappings: [Match.objectLike({ ContainerPort: 8080 })],
                }),
            ]),
        });
    });

    test("puts the service behind a public load balancer and outputs its DNS name", () => {
        template.hasResourceProperties("AWS::ElasticLoadBalancingV2::LoadBalancer", {
            Scheme: "internet-facing",
        });
        template.hasResourceProperties("AWS::ElasticLoadBalancingV2::Listener", {
            Port: 80,
            Protocol: "HTTP",
        });
        /* the deploy workflow reads this output to set the deployment URL */
        template.hasOutput("serviceloadbalancerdnsoutput", {});
    });
});
