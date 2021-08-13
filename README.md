<div align="center">
  <h1>firebase-util.js</h1>
  <p>Uma simples npm que facilita a utilidade de uso da firebase database realtime.</p>
  <p>
    <a href="https://www.npmjs.com/package/firebase-util.js"><img src="https://img.shields.io/npm/v/firebase-util.js?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/firebase-util.js"><img src="https://img.shields.io/npm/dt/firebase-util.js?maxAge=3600" alt="NPM downloads" /></a>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/firebase-util.js"><img src="https://nodei.co/npm/firebase-util.js.png?downloads=true&stars=true" alt="NPM Banner"></a>
  </p>
</div>

# 📦 Instalação:
```sh
npm i firebase-util.js
```
# 📡 Conexão:
### Existe dois tipos de conexão com a database:
#### Primeira opção:
```js
const FirebaseUtil = require('firebase-util.js');
const db = new FirebaseUtil({
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
});
```

#### Segunda opção:
```js
const FirebaseUtil = require('firebase-util.js');
const db = new FirebaseUtil({
  apiKey: "...",
  databaseURL: "..."
});
```

### ⚠️ apiKey e databaseURL são obrigatórios!

# 🧰 Funções:
```js
(async() => {
  await db.all();
  await db.ping();
  await db.get('caminho');
  await db.has('caminho');
  await db.del('caminho');
  await db.keys('caminho');
  await db.value('caminho');
  await db.toJSON('caminho');
  await db.entries('caminho');
  await db.set('caminho', 'valor');
  await db.push('caminho', 'valores');
  await db.upd('caminho', 'valor em objeto');
  await db.transaction('caminho', 'callback');
  await db.math('caminho', 'operadores aritméticos', 'valor');
})();
```

# 👷 Exemplos:

```js
const FirebaseUtil = require('firebase-util.js');
const db = new FirebaseUtil({
  apiKey: "...",
  databaseURL: "..."
});

(async() => {
  let ping = await db.ping();
  console.log(ping); // Latência.
  
  let all = await db.all();
  console.log(all); // {...}
  
  await db.set('bucky/money', 50); // True
  let money = await db.get('bucky/money');
  console.log(money); // 50
  
  await db.upd('bucky', { money: 60 }); // True
  let money2 = await db.get('bucky/money');
  console.log(money2); // 60
  
  await db.transaction('bucky/money', (money) => {
    return (money || 0) * 2 + 30
  });
  let money3 = await db.get('bucky/money');
  console.log(money3); // 150
  
  await db.math('bucky/money', '+', 50); // 200
  await db.math('bucky/money', '-', 20); // 180
  await db.math('bucky/money', '/', 2); // 90
  await db.math('bucky/money', '*', 4); // 360
  let money3 = await db.get('bucky/money');
  console.log(money3); // 360
  
  let money4 = await db.has('bucky/money');
  console.log(money4); // True
  
  await db.del('bucky'); // True
  
  await db.push('bucky', 'fofo'); // [ 'fofo' ]
  let val = await db.get('bucky');
  console.log(val); // { 0: 'fofo' }
  
  let entries = await db.entries('bucky');
  console.log(entries); // [ [ '1', 'fofo' ] ]
  
  let keys = await db.entries('bucky');
  console.log(keys); // [ '0' ]
  
  let values = await db.values('bucky');
  console.log(value); // [ 'fofo' ]
  
  let values2 = await db.toJSON('bucky');
  console.log(values2); // {"0":"fofo"}
})();
```

# 📦 Async / Await
A npm é construída com funções asincronas.
Elas serão melhores utilizadas com o uso de async/await para resolver a promise.
Saiba mais na documentação oficial da Mozilla: [Async/Await](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/await)