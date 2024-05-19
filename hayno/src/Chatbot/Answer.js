const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

async function processMessage(chatLog) {
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
            case '/clear':
                chatLog.clear();
                response = 'Chat history has been cleared.';
                break;
            default:
                return await getAnswer(chatLog);
        }
        return response.split(' ');
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


module.exports = { processMessage };