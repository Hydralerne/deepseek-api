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
        ...chat
    }
    if (currentChat?.last_id && !chat?.parent_id) {
        payload.parent_id = currentChat?.last_id
    }
    const response = await requestChatStream(payload, text)
    return streamResponse(response, (chunk) => {
        if(chunk?.length > 0){
            callback(chunk)
        }
        if (chunk.message_id && currentChat) {
            currentChat.last_id = chunk.message_id
        }
    }).then((data) => {
        return data
    }).catch(error => {
        return error
    })
}
