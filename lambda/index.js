const Alexa = require('ask-sdk-core');
const i18n = require('i18next');

const numbersGame = require("./numbers_game");
const factsGame = require("./facts_game");
const acronymsGame = require("./acronyms_game");


function pickFirstQuestion(sessionAttributes) {
    switch (sessionAttributes.quizType) {
        case "numbers": {
            return numbersGame.pickFirstQuestion(sessionAttributes);
        }
        case "facts": {
            return factsGame.pickFirstQuestion(sessionAttributes);
        }
        case "acronyms": {
            return acronymsGame.pickFirstQuestion(sessionAttributes);
        }
    }
    return "";
}

function getQuestion(quizType, questionId) {
    switch (quizType) {
        case "numbers": {
            return numbersGame.getQuestion(questionId);
        }
        case "facts": {
            return factsGame.getQuestion(questionId);
        }
        case "acronyms": {
            return acronymsGame.getQuestion(questionId);
        }
    }
    return "error";
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();

        sessionAttributes.quizType = null; //quiz user is playing
        sessionAttributes.questionsAnswered = []; //questions the user has answered
        sessionAttributes.questionId = -1; //question that is currently being asked

        return handlerInput.responseBuilder
            .speak("Welcome to our quiz skill! Which quiz do you want to play? Your options are: facts, acronyms or numbers.")
            .reprompt("Try saying what quiz you want me to start")
            .getResponse();
    }
};

const StartQuizHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StartQuiz';
    },
    handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();

        if(!sessionAttributes.quizType) {
            const question = pickFirstQuestion(sessionAttributes);
            
            if (question === "error") {
                return handlerInput.responseBuilder
                .speak("I'm sorry, I don't recognize that quiz. The available types are numbers, facts or acronyms")
                .reprompt("Try saying what quiz you want me to start!")
                .getResponse();
            } else {
                sessionAttributes.quizType = Alexa.getSlotValue(handlerInput.requestEnvelope, "quiztype"); //setting the quiz that is going to be played
                return handlerInput.responseBuilder
                    .speak("Okay, let's start the " + Alexa.getSlotValue(handlerInput.requestEnvelope, "quiztype") + " quiz! " + getQuestion(sessionAttributes.quizType, sessionAttributes.questionId))
                    .reprompt("Try making a guess!")
                    .getResponse();
            }
        } else {
            return handlerInput.responseBuilder
                .speak("You have already started the " + sessionAttributes.quizType + " quiz. Try to finish it first.")
                .reprompt("Try making a guess!")
                .getResponse();
        }
    }
};

const RepeatQuestionHandler = {
    canHandle(handlerInput) {
        const { attributesManager } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();

        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RepeatQuestion'
            && sessionAttributes.questionId >= 0;
    },
    handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();

        return handlerInput.responseBuilder
            .speak("Okay. The question is: " + getQuestion(sessionAttributes.quizType, sessionAttributes.questionId))
            .reprompt("Try making a guess!")
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Help intent!")
            .reprompt("Repromprt for help intent!")
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Goodbye!")
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Fallback handler")
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents
 * by defining them above, then also adding them to the request handler chain below
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = handlerInput.t('REFLECTOR_MSG', {intentName: intentName});

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error}`);

        return handlerInput.responseBuilder
            .speak("Error handler")
            .reprompt("Error handler reprompt")
            .getResponse();
    }
};

// This request interceptor will bind a translation function 't' to the handlerInput
// const LocalisationRequestInterceptor = {
//     process(handlerInput) {
//         i18n.init({
//             lng: Alexa.getLocale(handlerInput.requestEnvelope),
//             resources: languageStrings
//         }).then((t) => {
//             handlerInput.t = (...args) => t(...args);
//         });
//     }
// };


/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        StartQuizHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        numbersGame.NumberGuessHandler,
        factsGame.FactGuessHandler,
        acronymsGame.AcronymGuessHandler,
        RepeatQuestionHandler,
        SessionEndedRequestHandler,
        /* IntentReflectorHandler */)
    .addErrorHandlers(
        ErrorHandler)
    /*.addRequestInterceptors(
        LocalisationRequestInterceptor) */
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();