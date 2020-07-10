import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as AlexaSkill from '../lib/alexa_skill-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new AlexaSkill.AlexaSkillStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
