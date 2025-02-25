document.addEventListener('DOMContentLoaded', function() {
  // Load saved API key
  chrome.storage.sync.get(['openaiKey'], function(result) {
    if (result.openaiKey) {
      document.getElementById('apiKey').value = result.openaiKey;
    }
  });

  // Save API key when button is clicked
  document.getElementById('saveButton').addEventListener('click', function() {
    const apiKey = document.getElementById('apiKey').value;
    
    chrome.storage.sync.set({ openaiKey: apiKey }, function() {
      document.getElementById('status').textContent = 'API key saved!';
      // Close popup after 1 second
      setTimeout(() => {
        window.close();
      }, 1000);
    });
  });
}); 