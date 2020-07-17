const Alexa = require('ask-sdk-core');

const questions = [
    { id: 0, question: "How many employees are there at Amazon?", answer: 840000, acceptableRangeLow: 800000, acceptableRangeHigh: 900000 },
    { id: 1, question: "How many packages are delivered by Amazon every year?", answer: 2500000000, acceptableRangeLow: 2000000000, acceptableRangeHigh: 3000000000 },
    { id: 2, question: "How many different brands does Amazon own?", answer: 41, acceptableRangeLow: 40, acceptableRangeHigh: 45 }
];

module.exports = {
    getQuestion: function getQuestion() {
        const questionId = parseInt(Math.floor((Math.random() * questions.length)));
        return questions[questionId];
    },
    NumberGuessHandler: {
        canHandle(handlerInput) {
            const { attributesManager } = handlerInput;
            const sessionAttributes = attributesManager.getSessionAttributes();

            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
                && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NumberGuess'
                && sessionAttributes.quizType == "numbers";
        },
        handle(handlerInput) {
            const { attributesManager } = handlerInput;
            const sessionAttributes = attributesManager.getSessionAttributes();

            const question = questions[sessionAttributes.questionId];

            let speachOutput = "Sorry I did not understand. Try guessing a number";
            if (Alexa.getSlotValue(handlerInput.requestEnvelope, "number")) {
                const guess = parseInt(Alexa.getSlotValue(handlerInput.requestEnvelope, "number"));
                if (guess == question.answer) {
                    speachOutput = "You guessed exactly right! What do you want to do now? Start a numbers or a facts quiz?";
                    sessionAttributes.quizType = null;
                } else if (guess >= question.acceptableRangeLow && guess <= question.acceptableRangeHigh) {
                    speachOutput = "Ah! Close enough! The real answer is " + question.answer + " What do you want to do now? Start a numbers or a facts quiz?";
                    sessionAttributes.quizType = null;
                } else if (guess < question.answer) {
                    speachOutput = "Too low! Try guessing a higher number!";
                } else if (guess > question.answer) {
                    speachOutput = "Too high! Try guessing a lower number!";
                }
            }

            return handlerInput.responseBuilder
                .speak(speachOutput)
                .reprompt("Try guessing again!")
                .getResponse();
        }
    }
};