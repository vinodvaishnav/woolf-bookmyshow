class InValidInputError extends Error {
    constructor(message) {
        super(message);
        this.name = "InValidInputError";
        this.statusCode = 400; // Bad Request
    }
}

module.exports = InValidInputError;