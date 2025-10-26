import { Hono } from 'hono'

// Define the shape of the expected incoming JSON body
type CheckRequestBody = {
  item: string;
}

// Define the shape of the response
type CheckResponseBody = {
  status: 'Active' | 'Inactive' | 'Invalid';
  item: string;
}

const app = new Hono()

/**
 * POST /check
 *
 * Expects a JSON body with an 'item' property.
 * e.g., { "item": "prod-12345" }
 *
 * It will then simulate a check and return a status.
 */
app.post('/check', async (c) => {
  try {
    const { item } = await c.req.json<CheckRequestBody>()

    if (!item || typeof item !== 'string') {
      return c.json({ status: 'Invalid', item: 'N/A' } as CheckResponseBody, 400)
    }

    // --- MOCK LOGIC ---
    // This is where you would normally call an external API.
    // We will simulate a response based on the item's prefix.

    // Simulate a short delay
    await new Promise(resolve => setTimeout(resolve, 50));

    if (item.startsWith('prod-')) {
      return c.json({ status: 'Active', item: item } as CheckResponseBody)
    }

    if (item.startsWith('old-')) {
      return c.json({ status: 'Inactive', item: item } as CheckResponseBody)
    }

    return c.json({ status: 'Invalid', item: item } as CheckResponseBody)
    // --- END MOCK LOGIC ---

  } catch (error) {
    console.error('Error in /check handler:', error)
    return c.json({ error: 'Failed to process request' }, 500)
  }
})

// Add a simple GET route for testing the worker
app.get('/', (c) => {
  return c.text('Mock API Server is running. Send POST requests to /check.');
})

// Export the Hono app for the Cloudflare Worker
export default {
  fetch: app.fetch,
}

