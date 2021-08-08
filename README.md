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

# Instalação:
```sh
npm i firebase-util.js
```
# Conexão:
```js
const FirebaseUtil = require('firebase-util.js');
const db = new FirebaseUtil({
  apiKey: 'Sua API do banco de dados',
  databaseURL: 'Sua URL do banco de dados'
});
```
# Funções:
```js
(async() => {
  await db.ping();
  await db.get('caminho');
  await db.set('caminho', 'value');
  await db.del('caminho');
  await db.upd('caminho', 'value');
  await db.has('caminho');
})();
```
# Exemplos:
```js
(async() => {
  let ping = await db.ping();
  console.log(ping);// Latência da database
  
  await db.set('bucky/money', 20);// bucky: money: 20
  
  let money1 = await db.get('bucky/money');
  console.log(value);// bucky: money: 20
  
  await db.upd('bucky/money', 30);// bucky: money: 30
  
  await db.del('bucky/money');// Deleta oque foi pedido.
  
  let money2 = await db.has('bucky/money');
  console.log(money2);
  // False: sem dinheiro.
  // True: com dinheiro.
});
```
