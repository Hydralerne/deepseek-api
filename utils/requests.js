
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
    // 'Cookie': '__cf_bm=fsJIUz3t_v2KhHqkgkunnFEFvB16y1bWB43AiELMvWE-1736015167-1.0.1.1-hdwTAL.Jq.qAS0eRYYohvDWFXVFNmq62Xmq3AYyUvktokL90oacdET23mUpzDgO83My8V9RFJ5KlSjs54JFbGQ; HWWAFSESID=95f6b124fea1820df71; HWWAFSESTIME=1736003156412'
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
            headers: headers,
            body: body
        })

        return response

    } catch (e) {
        console.error(e);
        return { error: e.message };
    }
};