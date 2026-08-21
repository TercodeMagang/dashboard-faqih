import { api } from './src/lib/api.js';

async function test() {
  try {
    const res = await api.post('/auth/login', { email: 'wrong@gmail.com', password: '123' });
    console.log('SUCCESS:', res.data);
  } catch (e) {
    console.log('ERROR CAUGHT:', e.message);
  }
}

test();
