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
                response = 'Database search is not yet implemented.';
                break;
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
                response = JSON.stringify(states.vectorStorage.getVector(chatLog.first().content.split(' ')[1])).replace(",\"", ',\n\"');
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
            model: 'gpt-3.5-turbo',
            messages: chatLog.get(),
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