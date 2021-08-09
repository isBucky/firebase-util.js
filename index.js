const { initializeApp: init, database } = require('firebase');

class FirebaseUtil {
  constructor(options) {
    if (!global.firebaseConnect && typeof options !== 'object') return new Error('Não é um objeto!');
    if (!global.firebaseConnect && !options.apiKey) return new TypeError('apiKey não foi definida!');
    if (!global.firebaseConnect && !options.databaseURL) return new TypeError('databaseURL não foi definida!');
    
    this.db = this._connectToDatabase(options);
    this.version = require('./package.json').version;
    this.ping = this.Ping; this.get = this.Get;
    this.set = this.Set; this.del = this.Delete;
    this.upd = this.Update; this.has = this.Has;
    this.math = this.Math; this.all = this.All;
    this.push = this.Push; this.entries = this.Entries;
    this.keys = this.Keys; this.values = this.Values;
  }
  
  _connectToDatabase(options) {
    try {
      if (global.firebaseConnect) return database();
      global.firebaseConnect = true;
      return init(options).database();
    } catch(e) {
      return new Error('Erro ao conectar ao banco de dados.');
    }
  }
  
  async Ping() {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    let date = Date.now();
    return this.db.ref('FirebaseUtil').once('value').then(() => Date.now() - date);
  }
  
  async Get(path) {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    let value = await this.db.ref(path).once('value');
    return value.val();
  }
  
  async Set(path, value) {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    if (!value) return new TypeError('Você não definiu um valor!');
    try {
      await this.db.ref(path).set(value);
      return true;
    } catch(e) {
      return new Error(e);
    }
  }
  
  async Delete(path) {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    try {
      let value = await this.get(path);
      if (!value) return null;
      await this.db.ref(path).remove();
      return true;
    } catch(e) {
      return new Error(e);
    }
  }
  
  async Update(path, value) {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    if (!value) return new TypeError('Você não definiu um valor!');
    if (typeof value !== 'object') return new TypeError('O valor deve ser um objeto!');
    try {
      await this.db.ref(path).update(value);
      return true;
    } catch(e) {
      return new Error(e);
    }
  }
  
  async Has(path) {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      let value = await this.get(path);
      if (!value) return null;
      else return true;
    } catch(e) {
      return new Error(e);
    }
  }
  
  async Math(path, simbol, number) {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    if (!simbol) return new TypeError('Você não definiu um operador válido. Operadores: +, -, /, *, %');
    if (typeof simbol !== 'string') return new TypeError('Você não definiu um operador válido. Operadores: +, -, /, *, %');
    if (!number) return new TypeError('Você não definiu um valor!');
    if (isNaN(number)) return new TypeError('O valor definido não é um número!');
    switch (simbol) {
      case '+':
        let val1 = await this.get(path);
        if (!val1) val1 = 0;
        this.set(path, Number(val1) + Number(number));
        return Number(val1) + Number(number);
        break;
      case '-':
        let val2 = await this.get(path);
        if (!val2) val2 = 0;
        this.set(path, Number(val2) - Number(number));
        return Number(val2) - Number(number);
        break;
      case '/':
        let val3 = await this.get(path);
        if (!val3) val3 = 0;
        this.set(path, Number(val3) / Number(number));
        return Number(val3) / Number(number);
        break;
      case '*':
        let val4 = await this.get(path);
        if (!val4) val4 = 0;
        this.set(path, Number(val4) * Number(number));
        return Number(val4) * Number(number);
        break;
      default:
        throw new TypeError('Você não definiu um operador válido. Operadores: +, -, /, *, %');
        break;
    }
  }
  
  async All() {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      return await this.get('/');
    } catch(e) {
      return new Error(e);
    }
  }
  
  async Push(path, values) {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    if (!values) return new TypeError('Você não definiu um valor!');
    try {
      let 
        val = await this.entries(path),
        array = val.map(([key, value]) => value),
        num = Number(val.map(([key]) => key)[array.length - 1]);
      if (!num) num = 0;
      num = (num == 0 ? num : (num + 1)).toString();
      array.push(values);
      await this.db.set(path + '/' + num, values);
      return array;
    } catch(e) {
      return new Error(e);
    }
  }
  
  async Entries(path) {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      let values = await this.get(path);
      return Object.entries(values ? values : {});
    } catch(e) {
      return new Error(e);
    }
  }
  
  async Keys(path) {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      let values = await this.get(path);
      return Object.keys(values ? values : {});
    } catch(e) {
      return new Error(e);
    }
  }
  
  async Values(path) {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      let values = await this.get(path);
      return Object.values(values ? values : {});
    } catch(e) {
      return new Error(e);
    }
  }
}

module.exports = FirebaseUtil;