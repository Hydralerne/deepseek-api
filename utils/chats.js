import { RequestHeaders } from './requests.js'

export const chats = new Map()

export const createNewChat = async (token, id) => {
    try {
        let cookies = null
        const response = await fetch(
            'https://chat.deepseek.com/api/v0/chat_session/create',
            {
                method: 'POST',
                headers: {
                    ...RequestHeaders(),
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ agent: 'chat' })
            }
        )

        if (!response.ok) {
            throw new Error(`Failed to create chat: ${response.status}`);
        }

        const data = await response.json()
        const chatID = id || data.data.biz_data.id
        chats.set(chatID, { 
            id: data.data.biz_data.id, 
            token, 
            cookies,
            created_at: new Date().toISOString() 
        })
        return chatID
    } catch (e) {
        console.error('Chat creation failed:', e)
        return { error: e.message }
    }
}
