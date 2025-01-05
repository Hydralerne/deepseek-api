import { createNewChat, sendMessage } from '../index.js'

// Test function
async function testDeepSeekAPI() {
  try {
    const token =
      'add_token_here'

    console.log('1. Testing chat creation...')
    const chatID = await createNewChat(token)

    if (typeof chatID !== 'string') {
      throw new Error(`Chat creation failed: ${chatID.error}`)
    }
    console.log('✓ Chat created:', chatID)

    console.log('\n2. Testing message sending with code...')
    const messagePromise = new Promise((resolve, reject) => {
      let messageReceived = false
      let accumulatedMessage = ''
      let lastLogLength = 0

      let timeout = setTimeout(() => {
        if (!messageReceived) {
          reject(new Error('Message timeout - no response received'))
        }
      }, 30000)

      sendMessage(
        'Write a simple JavaScript function to add two numbers',
        { id: chatID, token },
        (response) => {
          messageReceived = true

          if (response === '') return; // Skip empty responses

          switch (response.type) {
            case 'message':
              if (response.content) {
                accumulatedMessage += response.content
                // Only log if we have new content
                if (accumulatedMessage.length > lastLogLength) {
                  console.log('New content:', response.content)
                  lastLogLength = accumulatedMessage.length
                }
              }
              break

            case 'thinking':
              console.log('AI is thinking...')
              break

            case 'error':
              console.error('Error occurred:', response.error)
              console.error('Details:', response.details)
              reject(new Error(`Stream error: ${response.error}`))
              break

            case 'done':
              console.log('\n========== FINAL MESSAGE ==========')
              console.log(accumulatedMessage)
              console.log('==================================')
              console.log('\n✓ Final message length:', accumulatedMessage.length)
              clearTimeout(timeout)
              resolve(accumulatedMessage)
              break

            default:
              if (response.finish_reason === 'stop') {
                console.log('\n========== FINAL MESSAGE ==========')
                console.log(accumulatedMessage)
                console.log('==================================')
                console.log('\n✓ Final message length:', accumulatedMessage.length)
                clearTimeout(timeout)
                resolve(accumulatedMessage)
              }
              break
          }
        }
      ).catch((error) => {
        console.error('Send message error:', error)
        reject(error)
      })
    })

    const finalMessage = await messagePromise
    console.log('\nTest completed successfully!')

  } catch (error) {
    console.error('Test failed:', error)
    process.exit(1)
  }
}

// Run the test
console.log('Starting DeepSeek API test...')
testDeepSeekAPI().catch((error) => {
  console.error('Test failed:', error)
  process.exit(1)
})
