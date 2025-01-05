
export const parseStreamResponse = (data) => {
    if (data === '[DONE]' || data.done) {
        return { 
            type: 'done',
            timestamp: new Date().toISOString()
        };
    }

    if (data.error) {
        return {
            type: 'error',
            error: data.error,
            details: data.details,
            timestamp: new Date().toISOString()
        };
    }

    // Handle streaming delta responses
    if (data.choices && data.choices[0]?.delta) {
        const delta = data.choices[0].delta;
        const finishReason = data.choices[0].finish_reason;
        
        // If we have a finish_reason but no content, treat it as done
        if (finishReason && !delta.content) {
            return {
                type: 'done',
                finish_reason: finishReason,
                timestamp: new Date().toISOString()
            };
        }

        return {
            type: 'message',
            content: delta.content || '',
            id: data.message_id,
            parent_id: data.parent_id,
            model: data.model,
            finish_reason: finishReason,
            timestamp: new Date().toISOString()
        };
    }

    // Handle other data types
    return {
        type: 'unknown',
        raw: data,
        timestamp: new Date().toISOString()
    };
}; 