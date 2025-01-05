import { requestChatStream } from "./utils/requests.js"
import { streamResponse } from "./utils/streams.js"
import { chats, createNewChat } from "./utils/chats.js"

export { requestChatStream, streamResponse, createNewChat, chats }

export const sendMessage = async (text, chat = {}, callback) => {
    if (!chat.id) {
        throw new Error('Chat id missed')
    }
    const currentChat = chats.get(chat.id)
    if (!currentChat) {
        console.error('Warning: Chat id is not registered in chats, please create one first')
    }
    if (!chat.token) {
        throw new Error('Token missed')
    }

    const payload = {
        ...chat,
        parent_id: chat.parent_id || currentChat?.last_id
    }

    try {
        const response = await requestChatStream(payload, text)
        
        // Enhanced callback wrapper to handle parsed messages
        const enhancedCallback = (data) => {
            if (data.type === 'message' && currentChat) {
                currentChat.last_id = data.id
            }
            callback(data)
        }

        return streamResponse(response, enhancedCallback)
    } catch (error) {
        return {
            type: 'error',
            error: error.message,
            details: error.stack
        }
    }
}
