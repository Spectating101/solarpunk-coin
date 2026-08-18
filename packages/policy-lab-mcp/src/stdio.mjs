import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { createPolicyLabMcpServer } from './server.mjs';

void serveStdio(createPolicyLabMcpServer);
console.error('SolarPunk Policy Lab MCP running on stdio');
