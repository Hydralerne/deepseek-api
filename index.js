
export const chats = {}

export const createNewChat = async (id, token) => {
    try {
        let cookies = null
        const response = await fetch('https://chat.deepseek.com/api/v0/chat_session/create', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ agent: 'chat' })
        })
        const data = await response.json()
        const chatID = data.data.biz_data.id
        chats[id] = { id: chatID, token, cookies }
        return chatID
    } catch (e) {
        return { error: e.message }
    }
}

export const message = async (chatID) => {
    try {
        if (!chats[chatID]) {
            return { error: 'chat_not_found' }
        }
        const response = await fetch('https://chat.deepseek.com/api/v0/chat/completion', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Cookie
            },
            body: JSON.stringify({ agent: 'chat' })
        })
        const data = await response.json()
        console.log(data)
        const chatID = data.data.biz_data.id
        chats[id] = chatID
        return chatID
    } catch (e) {
        return { error: e.message }
    }
}

(async () => {
    const data = await createNewChat('test','sz61Bfyihpenw53WnvDsDVvh3MYS1wPqwxJaNLxaGh5uHNEI+AxWvghViBvzSRlQ')
})