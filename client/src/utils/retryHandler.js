const MAX_RETRIES = 3;
const MIN_DELAY = 3000; // 3 seconds
const MAX_DELAY = 5000; // 5 seconds

const getRandomDelay = () => {
  return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
};

const shouldRetry = (error) => {
  // Don't retry if we have a response with these status codes
  if (error.response) {
    const status = error.response.status;
    if ([400, 401, 403, 429].includes(status)) {
      return false;
    }
  }

  // Retry on network errors or 5xx status codes
  return !error.response || error.response.status >= 500;
};

export const withRetry = async (apiCall, onError) => {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      if (!shouldRetry(error)) {
        throw error;
      }

      if (attempt < MAX_RETRIES) {
        const delay = getRandomDelay();
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // If we've exhausted all retries, show a user-friendly message
  if (onError) {
    onError('Máy chủ đang quá tải. Vui lòng thử lại sau vài phút.');
  }

  throw lastError;
};
