chrome.runtime.onInstalled.addListener(() => {
  console.log('Polishd Email Assistant installed');
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'POLISH_EMAIL') {
    console.log('Received polish request:', request.text);
    
    // Handle empty text
    if (!request.text.trim()) {
      console.log('Empty text received');
      sendResponse({ success: false, error: 'No text to polish' });
      return false;
    }

    // Log the API call attempt
    console.log('Attempting OpenAI API call...');
    
    polishEmail(request.text, request.apiKey)
      .then(polishedText => {
        console.log('API call successful:', polishedText);
        sendResponse({ success: true, polishedText });
      })
      .catch(error => {
        console.error('API call failed:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
  return false;
});

async function polishEmail(text, apiKey) {
  console.log('Making API request with key:', apiKey.substring(0, 3) + '...');
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "You are a professional email editor. Make the email concise, professional, and friendly. Maintain the core message but remove any unnecessary text."
        }, {
          role: "user",
          content: text
        }],
        temperature: 0.7
      })
    });

    console.log('API response status:', response.status);
    const data = await response.json();
    console.log('API response data:', data);

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to polish email');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
} 