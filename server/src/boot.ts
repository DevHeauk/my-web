import { execSync } from 'child_process';

console.log('[BOOT] Running prisma db push...');

try {
  execSync('npx prisma db push --accept-data-loss --skip-generate', {
    stdio: 'inherit',
    timeout: 30000,
  });
  console.log('[BOOT] DB sync completed');
} catch (err) {
  console.log('[BOOT] DB sync finished (timeout or error, continuing)');
}

console.log('[BOOT] Starting server...');
require('./index');
