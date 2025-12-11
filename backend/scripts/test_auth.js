(async () => {
  const base = 'http://localhost:4000/api';
  const creds = { username: 'deleon', password: 'deleon' };
  try {
    console.log('POST', base + '/auth/register');
    let r = await fetch(base + '/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(creds) });
    let text = await r.text();
    console.log('REGISTER status', r.status);
    console.log('REGISTER body:', text);
  } catch (e) {
    console.error('REGISTER error:', e.message || e);
  }
  try {
    console.log('POST', base + '/auth/login');
    let r2 = await fetch(base + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(creds) });
    let text2 = await r2.text();
    console.log('LOGIN status', r2.status);
    console.log('LOGIN body:', text2);
  } catch (e) {
    console.error('LOGIN error:', e.message || e);
  }
})();
