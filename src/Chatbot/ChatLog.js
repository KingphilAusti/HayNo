class ChatLog {
    constructor(log = []) {
        this.log = log;
    }
    add(role, content) {
        this.log.push({ 
            role: role, 
            content: content,
            number: this.log.length + 1
        });
    }
    updateEntry(role, content, number) {
        this.log[number] = { 
            role: role, 
            content: content,
            number: number
        };
    }
    updateLastEntry(content) {
        this.log[this.log.length - 1].content = content;
    }
    get() {
        return this.log;
    }
    first() {
        return this.log[this.log.length - 1] || '';
    }
    clear() {
        this.log = [];
    }
}

module.exports = ChatLog;