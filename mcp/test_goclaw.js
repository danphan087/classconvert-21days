import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { EventSource } from "eventsource";

global.EventSource = EventSource;

async function run() {
    console.log("Connecting...");
    const transport = new SSEClientTransport(new URL("http://103.97.127.198/mcp-api/sse"));
    const client = new Client({ name: "test", version: "1.0" });
    
    await client.connect(transport);
    console.log("Connected!");
    
    const tools = await client.listTools();
    console.log("Tools:", tools);
    
    process.exit(0);
}

run().catch(err => {
    console.error("Error:", err);
    process.exit(1);
});
