(async () => {
  const tests = [
    {name:'login', url:'https://feedback-collection-system-e0vr.onrender.com/auth/login', body:{email:'test@example.com', password:'password'}},
    {name:'forgot', url:'https://feedback-collection-system-e0vr.onrender.com/auth/forgot-password', body:{email:'test@example.com'}},
    {name:'register', url:'https://feedback-collection-system-e0vr.onrender.com/auth/register', body:{name:'Test User', email:'testuser@example.com', password:'password', role:'user', sector:''}}
  ];
  for (const t of tests) {
    try {
      const res = await fetch(t.url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(t.body)
      });
      const text = await res.text();
      console.log('TEST:', t.name);
      console.log('STATUS:', res.status);
      console.log('TEXT:', text);
      console.log('HEADERS:', JSON.stringify(Object.fromEntries(res.headers.entries())));
      console.log('---');
    } catch (e) {
      console.log('TEST:', t.name);
      console.log('ERROR:', e.message);
      console.log('---');
    }
  }
})();
