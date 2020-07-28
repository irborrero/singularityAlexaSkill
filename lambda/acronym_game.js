const Alexa = require('ask-sdk-core');

const questions = [
    {
        id: 0,
        question: "What does the acronym ‘EOD’ mean? Is it A: Explosive Ordnance Disposal, B: Ew Oh Dear or C: End Of Day?",
        correct: "c"
    },
    {
        id: 1,
        question: "What does the acronym 'ETA' mean? Is it A: Estimated Time of Arrival, B: Electronic Transaction Act or C: Extension Travel Adjustment?",
        correct: "a"
    },
    {
        id: 2,
        question: "What is MBR? Is it A: Mutual Beneficial Relationship, B: Monthly Business Review or C: Master Boot Record?",
        correct: "b"
    },
    {
        id: 3,
        question: "What does LGTM stand for? Is it A: Long Game, True Master, B: Little Grand Tittle Maximisation or C: Looks good to me?",
        correct: "c"
    },
];

function pickQuestion(sessionAttributes) {
    if (sessionAttributes.questionId >= 0) {
        sessionAttributes.questionsAnswered.push(sessionAttributes.questionId);
    }

    if(sessionAttributes.questionsAnswered.length === questions.length){
        sessionAttributes.quizType = null;
        sessionAttributes.questionId = -1;
    } else {
        //selecting next question that has not been asked
        let nextQuestionId = parseInt(Math.floor((Math.random() * questions.length)));
        while (sessionAttributes.questionsAnswered.includes(nextQuestionId)) {
            nextQuestionId = parseInt(Math.floor((Math.random() * questions.length)));
        }
        //changing to question
        sessionAttributes.questionId = nextQuestionId;
    }
}

module.exports = {

    pickFirstQuestion: function(sessionAttributes) {
        pickQuestion(sessionAttributes)
    },

    getQuestion: function(questionId) {
        return questions[questionId].question
    },

    AcronymGuessHandler: {
        canHandle(handlerInput) {
            const { attributesManager } = handlerInput;
            const sessionAttributes = attributesManager.getSessionAttributes();

            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
                && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AcronymGuess'
                && sessionAttributes.quizType === "acronyms";
        },
        handle(handlerInput) {
            const { attributesManager } = handlerInput;
            const sessionAttributes = attributesManager.getSessionAttributes();

            const guess = Alexa.getSlotValue(handlerInput.requestEnvelope, "letterGuess").toString();

            if (guess.toLowerCase() === questions[sessionAttributes.questionId].correct.toLowerCase()) {
                pickQuestion(sessionAttributes);

                if (sessionAttributes.questionId < 0) {
                    return handlerInput.responseBuilder
                        .speak("Great job! You have completed all the questions in this category! You can either stop or start a new quiz. What do you want to do?")
                        .reprompt("Do you want to stop or start a new quiz?")
                        .getResponse();
                } else {
                    return handlerInput.responseBuilder
                        .speak("That is correct! Next question: " + questions[sessionAttributes.questionId].question)
                        .reprompt("Try making a guess!")
                        .getResponse();
                }
            } else {
                return handlerInput.responseBuilder
                    .speak("That is not quite right, try again!")
                    .reprompt("Try making a guess!")
                    .getResponse();
            }
        }
    }
};