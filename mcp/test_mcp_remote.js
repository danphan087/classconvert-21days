import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import EventSource from "eventsource";
global.EventSource = EventSource;

async function testRemote() {
    console.log("Connecting to http://eduscalelab.com/mcp-api/sse...");
    const transport = new SSEClientTransport(new URL("http://eduscalelab.com/mcp-api/sse"));
    const client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });
    
    try {
        await client.connect(transport);
        console.log("Connected successfully!");
        
        const tools = await client.listTools();
        console.log("Tools discovered:", tools);
    } catch (e) {
        console.error("Error:", e);
    } finally {
        process.exit(0);
    }
}

testRemote();
