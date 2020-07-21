const Alexa = require('ask-sdk-core');

const questions = [
    { id: 0, question: "How many employees are there at Amazon?", answer: 840000, acceptableRangeLow: 800000, acceptableRangeHigh: 900000 },
    { id: 1, question: "How many packages are delivered by Amazon every year?", answer: 2500000000, acceptableRangeLow: 2000000000, acceptableRangeHigh: 3000000000 },
    { id: 2, question: "How many different brands does Amazon own?", answer: 41, acceptableRangeLow: 40, acceptableRangeHigh: 45 },
    { id: 3, question: "How many prime subscribers on 2020? Hint: it’s a 9 figures number.", answer: 150000000, acceptableRangeLow: 140000000, acceptableRangeHigh: 160000000 }
];


function pickQuestion(sessionAttributes) {
    if (sessionAttributes.questionId >= 0) {
        sessionAttributes.questionsAnswered.push(sessionAttributes.questionId);
    }

    if (sessionAttributes.questionsAnswered.length === questions.length) {
        sessionAttributes.quizType = null;
        sessionAttributes.questionId = -1;
    } else {
        //selecting next question that has not been asked
        let nextQuestionId = parseInt(Math.floor((Math.random() * questions.length)));
        while (sessionAttributes.questionsAnswered.includes(nextQuestionId)){
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

    NumberGuessHandler: {

        canHandle(handlerInput) {
            const { attributesManager } = handlerInput;
            const sessionAttributes = attributesManager.getSessionAttributes();

            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
                && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NumberGuess'
                && sessionAttributes.quizType === "numbers";
        },

        handle(handlerInput) {
            const { attributesManager } = handlerInput;
            const sessionAttributes = attributesManager.getSessionAttributes();

            const question = questions[sessionAttributes.questionId];

            let speachOutput = "Sorry I did not understand. Try guessing a number";
            let correctAnswer = false;
            if (Alexa.getSlotValue(handlerInput.requestEnvelope, "number")) {
                const guess = parseInt(Alexa.getSlotValue(handlerInput.requestEnvelope, "number"));
                if (guess === question.answer) {
                    speachOutput = "You guessed exactly right!";
                    correctAnswer = true;
                    pickQuestion(sessionAttributes);
                } else if (guess >= question.acceptableRangeLow && guess <= question.acceptableRangeHigh) {
                    speachOutput = "Ah! Close enough! The real answer is " + question.answer;
                    correctAnswer = true;
                    pickQuestion(sessionAttributes);
                } else if (guess < question.answer) {
                    speachOutput = "Too low! Try guessing a higher number!";
                } else if (guess > question.answer) {
                    speachOutput = "Too high! Try guessing a lower number!";
                }
            }

            if(correctAnswer) {
                if (sessionAttributes.questionId < 0) {
                    return handlerInput.responseBuilder
                        .speak("Great job! You have completed all the question in this category! You can either stop or start a new quiz. What do you want to do?")
                        .reprompt("Do you want to stop or start a new quiz?")
                        .getResponse();
                }

                //next question
                const nextQuestion = questions[sessionAttributes.questionId];
                return handlerInput.responseBuilder
                    .speak(speachOutput + ". Let's go for the next question. " + nextQuestion.question)
                    .reprompt("Try guessing again!")
                    .getResponse();
            }
            else {
                //try guessing again
                return handlerInput.responseBuilder
                    .speak(speachOutput)
                    .reprompt("Try guessing again!")
                    .getResponse();
            }
        }
    }
};
