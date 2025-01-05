import { getAgent } from "../lib/randomAgents.js";

export const RequestHeaders = (agent) => {
    return {
        'Content-Type': 'application/json',
        'User-Agent': agent == 'random' ? getAgent() : 'PostmanRuntime/7.43.0',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Host': 'https://chat.deepseek.com',
    }
};

export const requestChatStream = async (chat = {}, text, isThinkinEnabled = false, isSearchEnabled = false) => {
    const url = 'https://chat.deepseek.com/api/v0/chat/completion';
    try {
        if (!chat.id || !chat.token) {
            return { error: 'chat_not_found' };
        }
        let headers = {
            ...RequestHeaders(),
            'Authorization': `Bearer ${chat.token}`,
        }
        const body = JSON.stringify({
            "chat_session_id": chat.id,
            "parent_message_id": chat.parent_id || null,
            "prompt": text,
            "ref_file_ids": [],
            "thinking_enabled": isThinkinEnabled,
            "search_enabled": isSearchEnabled,
            "challenge_response": null
        });

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body
        });

        // Handle rate limiting response from DeepSeek
        if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            return { 
                error: 'rate_limit_exceeded',
                retryAfter: retryAfter ? parseInt(retryAfter) : 60,
                details: await response.text()
            };
        }

        if (!response.ok) {
            const errorText = await response.text();
            return { 
                error: `Request failed with status ${response.status}`,
                details: errorText
            };
        }

        return response;

    } catch (e) {
        console.error('Request failed:', e);
        return { error: e.message, details: e.stack };
    }
};