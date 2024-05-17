class chatLog {
    constructor() {
        this.log = [];
    }

    add(role, content) {
        this.log.unshift({ 
            role: role, 
            content: content,
            number: this.log.length + 1
        });
    }

    get() {
        return this.log;
    }
    
    clear() {
        this.log = [];
    }
}

module.exports = chatLog;