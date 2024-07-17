// Popup script to handle adding bookmarks and updating the popup
document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display bookmarks when the popup is loaded
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const videoId = new URLSearchParams(new URL(tabs[0].url).search).get('v');
      if (videoId) {
        chrome.storage.local.get([videoId], function(result) {
          let bookmarks = result[videoId] ? JSON.parse(result[videoId]) : [];
          updatePopup(bookmarks);
        });
      }
    });
  
    const addBookmarkButton = document.getElementById('add-bookmark');
    addBookmarkButton.addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: 'getTimestamp'}, function(response) {
          if (response.timestamp) {
            addBookmark(tabs[0].url, response.timestamp);
          }
        });
      });
    });
  });
  
  function addBookmark(url, timestamp) {
    const videoId = new URLSearchParams(new URL(url).search).get('v');
    chrome.storage.local.get([videoId], function(result) {
      let bookmarks = result[videoId] ? JSON.parse(result[videoId]) : [];
      bookmarks.push({ time: timestamp, desc: 'Bookmark at ' + getTime(timestamp) });
      chrome.storage.local.set({ [videoId]: JSON.stringify(bookmarks) }, function() {
        updatePopup(bookmarks);
      });
    });
  }
  
  function updatePopup(bookmarks) {
    const bookmarksElement = document.getElementById('bookmarks');
    bookmarksElement.innerHTML = '';
    bookmarks.forEach(function(bookmark) {
      const bookmarkElement = document.createElement('div');
      bookmarkElement.textContent = bookmark.desc;
      bookmarksElement.appendChild(bookmarkElement);
    });
  }
  
  function getTime(t) {
    const date = new Date(0);
    date.setSeconds(t);
    return date.toISOString().substr(11, 8);
  }
   