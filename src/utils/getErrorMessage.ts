export function getErrorMessage(error: any): string {
  // Handle MongoDB duplicate key error (code 11000)
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0]; // Extract the field that caused the error
    return `The ${field} '${error.keyValue[field]}' is already in use. Please choose a different ${field}.`;
  }

  // Handle other MongoDB specific errors (expand as needed)
  switch (error.code) {
    case 121: // Document validation failure
      return "Document validation failed.";
    case 2: // Bad value error
      return "A bad value was provided in the request.";
    case 26: // Namespace not found
      return "The requested namespace could not be found.";
    case 50: // Exceeded time limit
      return "The operation exceeded the time limit.";
    case 11001: // Duplicate key error (alternative code)
      return "A duplicate key error occurred.";
    default:
      // Return a generic error message with the code for debugging
      return `An unexpected error occurred. Code: ${
        error.code || "Unknown"
      }, Message: ${error.message}`;
  }
}
