
import { RequestHeaders } from './requests.js'

export const chats = new Map()

export const createNewChat = async (token, id) => {
    try {
        let cookies = null
        const response = await fetch('https://chat.deepseek.com/api/v0/chat_session/create', {
            method: 'POST',
            headers: {
                ...RequestHeaders(),
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ agent: 'chat' })
        })
        const data = await response.json()
        const chatID = data.data.biz_data.id
        chats.set(id || chatID, { id: chatID, token, cookies })
        return id || chatID
    } catch (e) {
        console.log(e)
        return { error: e.message }
    }
}


