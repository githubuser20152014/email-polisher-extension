// Listen for compose window in Gmail
function initializeEmailClient() {
  console.log('Initializing Polishd in Gmail...');
  
  // Add Polish button to compose window
  const composeButton = document.createElement('button');
  composeButton.innerHTML = '✨ Polish';
  composeButton.className = 'polish-button';
  
  composeButton.addEventListener('click', async () => {
    console.log('Polish button clicked');
    
    // Get subject and content from Gmail
    const subjectInput = document.querySelector('input[name="subjectbox"]');
    const editor = document.querySelector('[role="textbox"]');
    
    if (!editor) {
      console.log('No editor found');
      alert('Could not find email compose window');
      return;
    }

    const subject = subjectInput ? subjectInput.value : '';
    const content = editor.innerText || editor.textContent || '';
    console.log('Found email text:', { subject, content });
    
    if (!content.trim()) {
      alert('Please enter some text to polish');
      return;
    }
    
    // Get API key from storage
    chrome.storage.sync.get(['openaiKey'], async function(result) {
      if (!result.openaiKey) {
        alert('Please set your OpenAI API key in the extension settings');
        return;
      }

      try {
        // Show loading state
        composeButton.innerHTML = '⌛ Polishing...';
        
        // Send message to background script
        chrome.runtime.sendMessage({
          type: 'POLISH_EMAIL',
          text: `Subject: ${subject}\n\n${content}`,
          apiKey: result.openaiKey
        }, response => {
          if (response.success) {
            // Split response into subject and content
            const parts = response.polishedText.split('\n\n');
            let newSubject = '';
            let newContent = response.polishedText;
            
            // Check if response has Subject: prefix
            if (parts[0].startsWith('Subject:')) {
              newSubject = parts[0].replace('Subject:', '').trim();
              newContent = parts.slice(1).join('\n\n');
            }
            
            // Update subject if it exists
            if (subjectInput && newSubject) {
              subjectInput.value = newSubject;
              // Trigger input event to ensure Gmail saves the change
              subjectInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            
            // Update content
            editor.innerHTML = newContent
              .split('\n')
              .map(line => `<div>${line}</div>`)
              .join('') || '<div><br></div>';
            
            // Trigger input event to ensure Gmail saves the change
            editor.dispatchEvent(new Event('input', { bubbles: true }));
          } else {
            console.error('Polish failed:', response.error);
            alert('Failed to polish email: ' + response.error);
          }
          composeButton.innerHTML = '✨ Polish';
        });
      } catch (error) {
        console.error('Error:', error);
        composeButton.innerHTML = '✨ Polish';
        alert('Error polishing email. Please try again.');
      }
    });
  });

  // Add button to Gmail compose window
  const toolbar = document.querySelector('.btC') || // New compose
                 document.querySelector('.gU.Up'); // Reply
  
  if (toolbar && !toolbar.querySelector('.polish-button')) {
    console.log('Found Gmail toolbar, adding Polish button');
    const container = document.createElement('div');
    container.style.display = 'inline-flex';
    container.style.marginLeft = '8px';
    container.appendChild(composeButton);
    toolbar.appendChild(container);
  } else {
    console.log('Gmail toolbar not found');
  }
}

// Helper functions for Gmail
function getGmailText() {
  const editor = document.querySelector('[role="textbox"]');
  if (!editor) {
    console.log('Email editor not found');
    return '';
  }
  
  const text = editor.innerText || editor.textContent || '';
  console.log('Found email text:', text);
  return text;
}

function setGmailText(text) {
  const editor = document.querySelector('[role="textbox"]');
  if (editor) {
    editor.innerHTML = text;
  }
}

// Check periodically for compose window
setInterval(() => {
  const composeWindow = document.querySelector('.btC') || // New compose
                       document.querySelector('.gU.Up'); // Reply
  
  if (composeWindow && !composeWindow.querySelector('.polish-button')) {
    console.log('Found new compose window');
    initializeEmailClient();
  }
}, 1000);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeEmailClient);

// Helper functions for Outlook
function addButtonToOutlook(button) {
  const toolbar = document.querySelector('[role="toolbar"]') || 
                 document.querySelector('.ms-CommandBar');
  if (toolbar && !toolbar.querySelector('.polish-button')) {
    toolbar.appendChild(button);
  }
}

function getOutlookText() {
  const editor = document.querySelector('[contenteditable="true"]');
  return editor ? editor.innerHTML : '';
}

function setOutlookText(text) {
  const editor = document.querySelector('[contenteditable="true"]');
  if (editor) {
    editor.innerHTML = text;
  }
}

// Generic helper functions
function getEmailText() {
  if (window.location.hostname.includes('gmail')) {
    return getGmailText();
  } else if (window.location.hostname.includes('outlook')) {
    return getOutlookText();
  }
  return '';
}

function setEmailText(text) {
  if (window.location.hostname.includes('gmail')) {
    setGmailText(text);
  } else if (window.location.hostname.includes('outlook')) {
    setOutlookText(text);
  }
}

function addButtonToCompose(button) {
  if (window.location.hostname.includes('gmail')) {
    addButtonToGmail(button);
  } else if (window.location.hostname.includes('outlook')) {
    addButtonToOutlook(button);
  }
}

// Helper functions for Gmail
function addButtonToGmail(button) {
  // Target Gmail's specific compose toolbar
  const toolbar = document.querySelector('.btC') || // New compose
                 document.querySelector('.gU.Up') || // Reply
                 document.querySelector('[role="toolbar"]'); // Fallback
                 
  if (toolbar && !toolbar.querySelector('.polish-button')) {
    // Create a container div to match Gmail's style
    const container = document.createElement('div');
    container.className = 'polish-button-container';
    container.style.display = 'inline-flex';
    container.style.marginLeft = '8px';
    
    container.appendChild(button);
    toolbar.appendChild(container);
  }
}

// Modify the interval check to be more specific
function checkForComposeWindow() {
  const composeWindow = document.querySelector('.btC') || // New compose
                       document.querySelector('.gU.Up'); // Reply
  
  if (composeWindow && !composeWindow.querySelector('.polish-button')) {
    initializeEmailClient();
  }
}

// Start checking after page load
document.addEventListener('DOMContentLoaded', () => {
  // Initial check
  checkForComposeWindow();
  // Periodic check for compose window
  setInterval(checkForComposeWindow, 1000);
}); 