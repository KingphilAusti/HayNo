# HayNo
Simple RAG-System

# Description
HayNo is a chatbot combined with a built-in vector storage and a RAG-system. 

# Vector storage
Using the left panel, you can upload single files to add to the database. 
- Setting "Do embedding" uses an openAI embedding model to create a vector which is necessary for the database search
- Setting "Do Embedding per JSON entry" creates an embedding for each key in the provided file. Works only for semantically correct JSON files. 
- Setting "Do chunking" splits the text in Chunks of size "Chunking size"
- "Chunking Size" will soon be the number of words per text chunk. 

# Chat
Chat is a direct connection to chatGPT. You can chat normally and use some commands:
- /help: get an incomplete list of commands (wip)
- /search X: Search for X in database
- /size: get size of database (number of rows)
- /clear: clear chatLog
Images are not supported right now.

# .env
Set API Key for OpenAI here like "REACT_APP_OPENAI_API_KEY=". 

# Known bugs
- On Firefox: When saving the database the download fails. Clicking the download again restarts it, which works. 
- Database metrics are not updated correctly


# Thanks <3
Style from 
From https://codepen.io/FlorinPop17/pen/bJayqM
Question Prompt from
https://cookbook.openai.com/examples/question_answering_using_embeddings
