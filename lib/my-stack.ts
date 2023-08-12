import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class MyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const layer = new lambda.LayerVersion(this, 'MyLayer', {
      code: lambda.Code.fromAsset('assets/layer.zip'),
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_18_X,
      ],
    });

    const role = new iam.Role(this, 'MyRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AWSXRayDaemonWriteAccess'),
      ],
    });

    const lambdaFn = new lambda.Function(this, 'MyLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: 128,
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(30),
      environment: {
        VARIABLE_1: 'ONE'
      },
      code: lambda.Code.fromAsset('assets/lambda.zip'),
      role,
      currentVersionOptions: {
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
      layers: [
        layer,
      ],
    });

    const alias = new lambda.Alias(this, 'MyAlias', {
      aliasName: 'current',
      version: lambdaFn.currentVersion,
    });
  }
}
