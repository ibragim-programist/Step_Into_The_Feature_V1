import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverRoot = join(__dirname, '..');

export const paths = {
  users: join(serverRoot, 'data', 'Users.txt'),
  rooms: join(serverRoot, 'data', 'Rooms.txt'),
  messagesDir: join(serverRoot, 'data', 'Messages'),
};