const { initializeApp: init } = require('firebase');

class FirebaseUtility {
  constructor(options) {
    if (typeof options !== 'object') return new Error('Não é um objeto!');
    let { apiKey, databaseURL } = options;
    if (!apiKey) return new TypeError('apiKey não foi definida!');
    if (!databaseURL) return new TypeError('databaseURL não foi definida!');
    
    this.db = this._connectToDatabase(apiKey, databaseURL);
    this.version = require('./package.json').version;
    this.ping = this.Ping; this.get = this.Get;
    this.set = this.Set; this.del = this.Delete;
    this.upd = this.Update; this.has = this.Has;
  }
  
  _connectToDatabase(apiKey, databaseURL) {
    try {
      return init({ apiKey, databaseURL }).database();
    } catch(e) {
      return new Error('Erro ao conectar ao banco de dados.');
    }
  }
  
  async Ping() {
    if (!this.db) return null;
    let date = Date.now();
    return this.get('FirebaseUtility').then(() => Date.now() - date);
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
      return await this.db.ref(path).remove();
    } catch(e) {
      return new Error(e);
    }
  }
  
  async Update(path, value) {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    if (!value) return new TypeError('Você não definiu um valor!');
    try {
      return await this.db.ref(path).update(value);
    } catch(e) {
      return Error(e);
    }
  }
  
  async Has(path) {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    try {
      let value = await this.get(path);
      if (!value) return null;
      else return true;
    } catch(e) {
      return Error(e);
    }
  }
}

module.exports = FirebaseUtility;
