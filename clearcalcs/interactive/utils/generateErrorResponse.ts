export default function generateErrorResponse(error: Error) {
    return {
        error: true,
        errorType: error.name,
        errorMessage: error.message,
    };
}
