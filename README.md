# Polishd Email Assistant

A browser extension that uses AI to polish your emails - making them more professional and concise while maintaining your message's intent.

## Features

- One-click email polishing in Gmail
- Maintains proper email formatting (subject line, content, signature)
- Real-time processing using OpenAI's GPT model
- Simple and intuitive interface
- Preserves email structure and formatting

## Screenshots

![Polishd Button in Gmail](docs/images/polish-button.png)
![Before and After Polish](docs/images/before-after.png)
![API Key Setup](docs/images/api-setup.png)

## Installation

1. Clone this repository
2. Open Brave/Chrome and navigate to `brave://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `email-polisher-extension` folder

## Setup

1. Click the Polishd icon in your browser toolbar
2. Enter your OpenAI API key
3. Click Save

## Usage

1. Open Gmail and compose a new email
2. Write your email content
3. Click the "✨ Polish" button in the compose window
4. Your email will be automatically polished while maintaining its core message

## Requirements

- OpenAI API key
- Brave or Chrome browser
- Gmail web interface

## Privacy

This extension:
- Only processes emails when you click the Polish button
- Sends email content to OpenAI's API for processing
- Does not store or collect any email content
- Only stores your API key locally in your browser

## Development

Built with:
- JavaScript
- Chrome Extensions API
- OpenAI API

### Project Structure 