import cdk = require('@aws-cdk/core');
import {Code, Function, Runtime} from "@aws-cdk/aws-lambda"

export class AlexaSkillStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new Function(this, "lambda", {
      runtime: Runtime.NODEJS_10_X,    // execution environment
      code: Code.fromAsset('lambda'),  // code loaded from "lambda" directory
      handler: 'index.handler'                // file is "hello", function is "handler"
    });
  }
}
