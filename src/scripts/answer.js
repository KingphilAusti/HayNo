require('dotenv').config();
const { OpenAI } = require('openai');

const chatLog = require('./chatLog');
const chatHistory = new chatLog();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function processMessage(message) {
    chatHistory.add('user', message);
    switch (message.split(' ')[0].toLowerCase()) {
        case '/help':
            return 'You can ask me anything you want. \
                    Here is a list of commands you can use: \
                    /help, /search, /searchDatabase';
        case '/search':
        case '/searchDatabase':
            return 'Database search is not yet implemented.';
        case '/clear':
            chatHistory.clear();
            return 'Chat history has been cleared.';
        default:
            return await getAnswer(chatHistory);
    }
}

async function getAnswer(chatHistory) {
    const answer = await getGeneralAnswerFromOpenAI(chatHistory);
    return answer;
}

async function getGeneralAnswerFromOpenAI(chatHistory) {
    const answer = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: chatHistory.get(),
        stream: false,
    })
    const content = answer.choices[0].message.content;
    chatHistory.add('assistant', content);
    return content;
}

module.exports = processMessage;