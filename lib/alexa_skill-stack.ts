import cdk = require('@aws-cdk/core');
import {Code, Function, Runtime} from "@aws-cdk/aws-lambda"
import {Bucket} from "@aws-cdk/aws-s3"

export class AlexaSkillStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new Function(this, "lambda", {
      functionName: "alexaSkillInterQuizGame",
      runtime: Runtime.NODEJS_10_X,    // execution environment
      code: Code.fromAsset('lambda'),  // code loaded from "lambda" directory
      handler: 'index.handler'                // file is "hello", function is "handler"
    });
  }
}
