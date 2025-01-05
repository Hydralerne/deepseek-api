import { parseStreamResponse } from './parser.js';

export const streamResponse = (response, callback = () => { }) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        
        if (!response.ok) {
            return reject({
                error: `Stream error`,
                status: response.status,
                details: response.statusText
            });
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        const readStream = () => {
            reader.read().then(({ done, value }) => {
                if (done) {
                    resolve(chunks);
                    return;
                }

                const chunk = decoder.decode(value, { stream: true });

                chunk.split('\n').forEach(line => {
                    let data = line;
                    if (line.startsWith('data:')) {
                        const jsonString = line.slice(5).trim();
                        if (jsonString) {
                            try {
                                if (jsonString === '[DONE]') {
                                    data = { done: true };
                                } else {
                                    const rawData = JSON.parse(jsonString);
                                    // Parse the response into a more user-friendly format
                                    data = parseStreamResponse(rawData);
                                }
                            } catch (error) {
                                console.error('Error parsing stream data:', error);
                                console.error('Malformed JSON:', jsonString); // Log the problematic JSON
                                data = { 
                                    type: 'error',
                                    error: 'stream_parse_error',
                                    details: error.message
                                };
                            }
                        }
                    }

                    callback(data);
                    chunks.push(data);
                });

                readStream();
            }).catch(error => {
                reject({
                    type: 'error',
                    error: 'stream_read_error',
                    details: error.message
                });
            });
        };

        readStream();
    });
};