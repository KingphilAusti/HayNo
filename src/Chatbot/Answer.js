const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true });
const ChatLog = require('./ChatLog');

/**
 * Processes the incoming chat message and generates a response based on the command.
 * @param {Array} chatLog - The chat log containing the messages.
 * @param {Array} states - The states used for processing the message.
 * @returns {Promise<string>} - The generated response.
 */
async function processMessage(chatLog, states) {
    try {
        let response = '';
        switch (chatLog.first().content.split(' ')[0].toLowerCase()) {
            case '/help':
                response = 'You can ask me anything you want.  Here is a list of commands you can use:  /help, /search, /searchDatabase';
                break;
            case '/search':
            case '/searchDatabase':
                let query = chatLog.first().content.replace('/search', '').replace('/searchDatabase', '').trim();
                let queryResult = await states.vectorStorage.searchDatabase(query);
                query = getQueryFromNearestNeighbors(query, queryResult);
                return await getAnswerFromOpenAI(query).then((response) => { return processStringStream(response, states); });
            case '/loaddatabase':
            case '/load':
                states.vectorStorage.readFromFile();
                states.setVectorStorage(states.vectorStorage);
                response = 'Database loaded successfully. Hopefully.';
                break;
            case '/savedatabase':
            case '/save':
                states.vectorStorage.saveToFile();
                response = 'Database saving is not yet implemented.';
                break;
            case '/getnumberofvectors':
            case '/size':
                response = 'Number of vectors: ' + states.vectorStorage.getNumberOfVectors();
                break;
            case '/getvector':
                let vectorId = chatLog.first().content.split(' ')[1];
                if (!vectorId) {
                    response = 'Please provide a vector id.';
                } else if (vectorId >= states.vectorStorage.getNumberOfVectors()) {
                    response = 'Vector id out of range. Please provide a value between 0 and ' + (states.vectorStorage.getNumberOfVectors() - 1) + '.';
                } else {
                    response = JSON.stringify(states.vectorStorage.getVector(vectorId)).replace(",\"", ',\n\"');
                }
                break;
            case '/clear':
                chatLog.clear();
                response = 'Chat history has been cleared.';
                break;
            default:
                return await getAnswer(chatLog).then((response) => { return processStringStream(response, states); })
        }
        return await processStringStream(response.split(' '), states);
    } catch (error) {
        console.error(error);
        return 'Message not splittable.';
    }
}


async function getAnswer(chatLog) {
    const answer = await getGeneralAnswerFromOpenAI(chatLog);
    return answer;
}

async function getGeneralAnswerFromOpenAI(chatLog) {
    try {
        const response = await openai.chat.completions.create({
            model: process.env.REACT_APP_COMPLETION_MODEL,
            messages: chatLog.get(),
            stream: true,
        });
        return response;
    } catch (error) {
        console.error(error);
        return 'Error occurred while generating.';
    }
}

function getQueryFromNearestNeighbors(question, nearestNeighbors) {
    const introduction = 'Use the below entries to answer the subsequent question. If the answer cannot be found in the articles, write "I could not find an answer."'
    let message = introduction
    for (let nearestNeighbor of nearestNeighbors) {
        let next_article = '\n\n' + nearestNeighbor.source + ':\n\n' + nearestNeighbor.entry.content.content + '\n\n';
        message += next_article
    }
    return message + "\n\nQuestion: " + question
}

async function getAnswerFromOpenAI(query) {
    try {
        const response = await openai.chat.completions.create({
            model: process.env.REACT_APP_COMPLETION_MODEL,
            messages: [{ role: 'system', content: 'You are a friendly assistant.' }, { role: 'user', content: query }],
            stream: true,
        });
        return response;
    } catch (error) {
        console.error(error);
        return 'Error occurred while generating.';
    }
}

/**
 * Processes a string stream and updates the chat log and states accordingly.
 * @param {ReadableStream|Array} stream - The string stream to process. It can be either a ReadableStream or an Array.
 * @param {Object} states - The states object containing the chat log and other state information.
 * @returns {Promise<void>} - A promise that resolves when the processing is complete.
 */
const processStringStream = async (stream, states) => {
    try {   
        const newChatLog = new ChatLog(states.chatLog.log);
        var currentAnswer = '';
        newChatLog.add('assistant', 'Processing...');

        const updateStates = async () => {
            states.setUpdateCall(currentAnswer);
            newChatLog.updateLastEntry(currentAnswer);
            states.setChatLog(newChatLog);
        }

        if (stream.iterator) {
            for await (const part of stream) {
                currentAnswer += part.choices[0]?.delta?.content || '';
                updateStates();
            }
        } else if (Array.isArray(stream)) {
            for (const part of stream) {
                currentAnswer += part + ' ';
                updateStates();
            }
        } else {
            console.error('Stream is not iterable');
        };
    } catch (error) {
        console.error(error);
    }
};


module.exports = { processMessage };