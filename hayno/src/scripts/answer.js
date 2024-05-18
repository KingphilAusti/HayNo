// const { OpenAI } = require('openai');
// const openai = new OpenAI({apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true});

async function processMessage(chatLog) {
    try {
        switch (chatLog.first().content.split(' ')[0].toLowerCase()) {
            case '/help':
                return 'You can ask me anything you want.  Here is a list of commands you can use:  /help, /search, /searchDatabase';
            case '/search':
            case '/searchDatabase':
                return 'Database search is not yet implemented.';
            case '/clear':
                chatLog.clear();
                return 'Chat history has been cleared.';
            default:
                return await getAnswer(chatLog);
    }
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
    // const promptInput = document.getElementById("promptInput");
    // const generateBtn = document.getElementById("generateBtn");
    // const stopBtn = document.getElementById("stopBtn");
    // const resultText = document.getElementById("resultText");

    // let controller = null; // Store the AbortController instance

    // const generate = async () => {
    // // Alert the user if no prompt value
    // if (!promptInput.value) {
    //     alert("Please enter a prompt.");
    //     return;
    // }

    // // Disable the generate button and enable the stop button
    // generateBtn.disabled = true;
    // stopBtn.disabled = false;
    // resultText.innerText = "Generating...";

    // // Create a new AbortController instance
    // controller = new AbortController();
    // const signal = controller.signal;

    // try {
    //     const response = await openai.chat.completions.create({
    //         model: 'gpt-3.5-turbo',
    //         messages: chatLog.get(),
    //         stream: true,
    //     })

    //     // Read the response as a stream of data
    //     const reader = response.body.getReader();
    //     const decoder = new TextDecoder("utf-8");
    //     resultText.innerText = "";
    
    //     while (true) {
    //       const { done, value } = await reader.read();
    //       if (done) {
    //         break;
    //       }
    //       // Massage and parse the chunk of data
    //       const chunk = decoder.decode(value);
    //       const lines = chunk.split("\\n");
    //       const parsedLines = lines
    //         .map((line) => line.replace(/^data: /, "").trim()) // Remove the "data: " prefix
    //         .filter((line) => line !== "" && line !== "[DONE]") // Remove empty lines and "[DONE]"
    //         .map((line) => JSON.parse(line)); // Parse the JSON string
    
    //       for (const parsedLine of parsedLines) {
    //         const { choices } = parsedLine;
    //         const { delta } = choices[0];
    //         const { content } = delta;
    //         // Update the UI with the new content
    //         if (content) {
    //           resultText.innerText += content;
    //         }
    //       }
    //     }
    //   } catch (error) {
    //     // Handle fetch request errors
    //     if (signal.aborted) {
    //       resultText.innerText = "Request aborted.";
    //     } else {
    //       console.error("Error:", error);
    //       resultText.innerText = "Error occurred while generating.";
    //     }
    //   } finally {
    //     // Enable the generate button and disable the stop button
    //     generateBtn.disabled = false;
    //     stopBtn.disabled = true;
    //     controller = null; // Reset the AbortController instance
    //   }
    // };
    //   const stop = () => {
    //     // Abort the fetch request by calling abort() on the AbortController instance
    //     if (controller) {
    //       controller.abort();
    //       controller = null;
    //     }
    //   };
      
    //   promptInput.addEventListener("keyup", (event) => {
    //     if (event.key === "Enter") {
    //       generate();
    //     }
    //   });
    //   generateBtn.addEventListener("click", generate);
    //   stopBtn.addEventListener("click", stop);

    return 'This is a placeholder answer.';
}

module.exports = { processMessage };