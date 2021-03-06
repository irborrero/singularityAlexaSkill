const Alexa = require('ask-sdk-core');

const questions = [
    {
        id: 0,
        question: "True or false? Cheetos are the Jeff Bezos favorite chips.",
        true: "Oh, okay, I see, we are in the presence of a good player here ! I don’t want to seem obsessed with Jeff, but he does really likes thoses chips",
        false: "Well tried, but they really are his favorite chips. I don’t want to appear obsessed with Jeff, but he his my maker after all. Now you know, it will definetly help you to socialize!"
    },
    {
        id: 1,
        question: "True or false? Jeff Bezos made his first sell 25 years ago. ",
        true: "Right! As Jeff began his business, the first thing Amazon sold was a book called Fluid Concepts and Creative Analogies by Doug Hofstadte. It was sold on April 3rd, 1995. You weren’t even born, maggot!",
        false: "You loose ! As Jeff Bezos began his business, the first thing Amazon sold was a book called Fluid Concepts and Creative Analogies by Doug Hofstadte. It was sold on April 3rd, 1995. You weren’t even born, maggot !"
    },
    {
        id: 2,
        question: "We will see how much you studied for your interviews. Amazon won 46 emmy nominations of prime video on 2019. True or false? ",
        true: "No you dummy, it was 47 ! But I’ll grant you it was not an easy one",
        false: "You do have some brains ! Amazon actually won 47 emmy nominations thanks to Prime video"
    },
    {
        id: 3,
        question: "True or false? It is possible to use a door as a table.",
        true: "You are totally in the right! It was the summer of 1995, back when Jeff Bezos could count his Amazon employees on one hand and those few employees needed desks. Doors were a lot cheaper than desk, so he decided to put some legs on it. Never forget, you can do a lot with few things",
        false: "Please buy yourself some imagination! Everything is possible ! And about that door,  it was the summer of 1995, back when Jeff Bezos could count his Amazon employees on one hand and those few employees needed desks. Doors were a lot cheaper than desk, so he decided to put some legs on it. Never forget, you can do a lot with few things"
    },
    {
        id: 4,
        question: "True or false? Seattle arena’s real name is ‘Climate change arena’",
        true: "It actually is ! You are so brilliant little intern. Amazon just bought the naming rights to the historic Seattle arena previously known as ‘KeyArena’ to ‘Climate change Arena’  as a regular reminder of the urgent need for climate action",
        false: "I do agree, it is an unregular name for an arena, but it is true ! Amazon just bought the naming rights to the historic Seattle arena previously known as ‘KeyArena’ to ‘Climate change Arena’  as a regular reminder of the urgent need for climate action. Well done right ?"
    }
];

function pickQuestion(sessionAttributes) {
    if (sessionAttributes.questionId >= 0) {
        sessionAttributes.questionsAnswered.push(sessionAttributes.questionId);
    }

    if(sessionAttributes.questionsAnswered.length === questions.length){
        sessionAttributes.quizType = null;
        sessionAttributes.questionId = -1;
        sessionAttributes.questionsAnswered = [];
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

    FactGuessHandler: {
        canHandle(handlerInput) {
            const { attributesManager } = handlerInput;
            const sessionAttributes = attributesManager.getSessionAttributes();

            return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
                && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FactTrueFalse'
                && sessionAttributes.quizType === "facts";
        },
        handle(handlerInput) {
            const {attributesManager} = handlerInput;
            const sessionAttributes = attributesManager.getSessionAttributes();

            const guess = Alexa.getSlotValue(handlerInput.requestEnvelope, "factGuess").toString();
            let speechOutput = "hello";
            if(guess === "true")
               speechOutput = questions[sessionAttributes.questionId].true;
            else
                speechOutput = questions[sessionAttributes.questionId].false;

            pickQuestion(sessionAttributes);

            if (sessionAttributes.questionId < 0) {
                return handlerInput.responseBuilder
                    .speak(speechOutput + ". Great job! You have completed all the questions in this category! You can either stop or start a new quiz. What do you want to do?")
                    .reprompt("Do you want to stop or start a new quiz?")
                    .getResponse();
            }

            return handlerInput.responseBuilder
                .speak(speechOutput + ". Next question: " + questions[sessionAttributes.questionId].question)
                .reprompt("Try making a guess!")
                .getResponse();
        }
    }
};