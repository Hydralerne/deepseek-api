# DeepSeek API

DeepSeek API is a powerful Node.js library designed to interact with DeepSeek's chat system. With this library, you can create chat sessions, send messages, and handle chat streams efficiently.

## Installation

To install the DeepSeek API package, use the following command:

```bash
npm install deepseek-api
```

## Core Features

- **Send Messages**: Interact with DeepSeek chats by sending messages.
- **Chat Streams**: Stream responses in real-time.
- **Chat Management**: Create and manage chat sessions.
- **Structured Data**: Well-formatted response objects for easy integration.

## Important Note

DeepSeek uses Cloudflare for changing IPs, which might cause issues when using this API server-side with tokens obtained from your browser. We are actively working on a workaround solution to address this.

## API Reference

### Importing the Library

```javascript
import { sendMessage, createNewChat, chats } from 'deepseek-api';
```

### Functions

#### `createNewChat(token: string, id?: string): Promise<string | { error: string }>`

Creates a new chat session and stores its details in the `chats` map.

- **Parameters**:
  - `token` (string): The authentication token for DeepSeek.
  - `id` (string, optional): A custom chat ID. If not provided, the original ID from DeepSeek will be used.

- **Returns**:
  - A promise that resolves to the chat ID or an error object.

- **Example**:

```javascript
const chatID = await createNewChat('your-token-here');
console.log(`Chat created with ID: ${chatID}`);
```

#### `sendMessage(text: string, chat: { id: string; token: string; parent_id?: string }, callback: Function): Promise<any>`

Sends a message to the specified chat session and streams the response.

- **Parameters**:
  - `text` (string): The message to send.
  - `chat` (object): The chat details, including:
    - `id` (string): The chat session ID.
    - `token` (string): The authentication token.
    - `parent_id` (string, optional): The ID of the message to reply to (defaults to the last message in the chat).
  - `callback` (Function): A callback function to process each chunk of the response.

- **Returns**:
  - A promise that resolves to the final response data or an error object.

- **Example**:

```javascript
await sendMessage('Hello, DeepSeek!', { 
  id: 'chat-id-here', 
  token: 'your-token-here' 
}, (chunk) => {
  console.log('Stream chunk:', chunk);
});
```

#### `chats`

A `Map` object that stores all chat details, indexed by their IDs. Each chat entry includes:

- `id`: The chat session ID.
- `token`: The authentication token.
- `cookies`: Any associated cookies (currently `null`).

### Utility Functions

#### `requestChatStream(payload: object, text: string): Promise<any>`

Initiates a chat stream request.

#### `streamResponse(response: any, callback: Function): Promise<any>`

Processes a streaming response, invoking the callback for each chunk.

## Authentication

To authenticate with DeepSeek:

1. Log in to DeepSeek Chat.
2. Retrieve the token using the browser's console:

   ```javascript
   localStorage.getItem('userToken');
   ```

   The token will look like this:

   ```json
   {"value":"your-token-here","__version":"0"}
   ```

3. Use the `value` field from the token object as your authentication token.

## Usage Example

Here is a complete example of creating a chat session and sending a message:

```javascript
import { createNewChat, sendMessage } from 'deepseek-api';

(async () => {
  const token = 'your-token-here';

  // Step 1: Create a new chat session
  const chatID = await createNewChat(token);

  if (typeof chatID === 'string') {
    console.log(`Chat session created: ${chatID}`);

    // Step 2: Send a message
    await sendMessage('Hello, DeepSeek!', {
      id: chatID,
      token: token
    }, (chunk) => {
      console.log('Response chunk:', chunk);
    });
  } else {
    console.error('Error creating chat session:', chatID.error);
  }
})();
```

## Error Handling

- Ensure that the chat ID is valid and registered in the `chats` map before sending a message.
- Check that the token is correctly retrieved and passed to the functions.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Future Development

This package currently retrieves raw JSON responses directly from the DeepSeek API. We are actively working on enhancing the library to parse this data and provide a user-friendly interface that mimics a real chat experience. Stay tuned for updates!

## Contributions

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/hydralerne/deepseek-api/issues).

## Response Format

The library now provides structured response objects for different types of messages:

### Message Response

```javascript
{
    type: 'message',
    content: 'The message content',
    id: 'message-id',
    role: 'assistant',
    metadata: {
        model: 'model-name',
        usage: { /* token usage stats */ },
        finish_reason: 'stop'
    },
    timestamp: '2024-01-01T00:00:00.000Z'
}
```

### Other Response Types

```javascript
// Done Response
{
    type: 'done',
    timestamp: '2024-01-01T00:00:00.000Z'
}

// Error Response
{
    type: 'error',
    error: 'error_type',
    details: 'Error details',
    timestamp: '2024-01-01T00:00:00.000Z'
}

// Thinking State
{
    type: 'thinking',
    status: 'thinking_status',
    timestamp: '2024-01-01T00:00:00.000Z'
}

// Search Results
{
    type: 'search',
    results: [/* search results */],
    timestamp: '2024-01-01T00:00:00.000Z'
}
```

## Enhanced Usage Example

Here's how to use the enhanced parsing features:

```javascript
import { createNewChat, sendMessage } from 'deepseek-api';

(async () => {
    const token = 'your-token-here';
    const chatID = await createNewChat(token);

    if (typeof chatID === 'string') {
        await sendMessage('Write a JavaScript function', {
            id: chatID,
            token: token
        }, (response) => {
            switch(response.type) {
                case 'message':
                    console.log('Content:', response.content);
                    break;

                case 'thinking':
                    console.log('AI is thinking...');
                    break;

                case 'error':
                    console.error('Error:', response.error);
                    break;

                case 'done':
                    console.log('Response complete');
                    break;
            }
        });
    }
})();
```

## Parsing Features

### Code Block Parsing

- Automatically extracts code blocks from messages
- Identifies programming languages
- Separates code from regular text

### Metadata

- Model information
- Token usage statistics
- Completion status
- Timestamps for all events

### Response Types

- `message`: Regular message content
- `thinking`: AI processing status
- `search`: Search results when enabled
- `error`: Error information
- `done`: Completion indicator

---
