// Content script to interact with the YouTube page and send messages to the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'getTimestamp') {
      const videoPlayer = document.querySelector('video');
      if (videoPlayer) {
        sendResponse({ timestamp: videoPlayer.currentTime });
      }
    }
    return true; // Keep the message channel open for async response
  });
  