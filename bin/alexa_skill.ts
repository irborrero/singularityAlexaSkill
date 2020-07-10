#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AlexaSkillStack } from '../lib/alexa_skill-stack';

const app = new cdk.App();
new AlexaSkillStack(app, 'AlexaSkillStack');
