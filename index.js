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
    this.Transaction = this.transaction;
    this.push = this.Push; this.entries = this.Entries;
    this.keys = this.Keys; this.values = this.Values;
    this.toJSON = this.ToJSON;
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
    return this.db.ref(path).once('value').then(i => i.val());
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
      if (!value) return false;
      else return true;
    } catch(e) {
      return new Error(e);
    }
  }
  
  async transaction(path, callback) {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    
    if(!callback) return new TypeError('Você precisa inserir uma função de callback!');
    
    if(typeof callback !== 'function') return new TypeError('O parâmetro callback precisa ser uma função!');
    
    try {
      const val = await this.get(path);
      
      const callResult = await callback(val);
      
      return this.set(path, callResult);
    } catch(err) {
        return new Error(e);
    }
  }
  
  async All() {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
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
      const val = await this.get(path);
      
      if(!Array.isArray(val)) return new TypeError('Você não pode dar push em algo que não é um Array!');
      
      val.push(...values);
      
      await this.set(path, val);
      
      return val;
    } catch(e) {
      return new Error(e);
    }
  }
  
  async Entries(path) {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      return this.get(path).then(values => Object.entries(values ? values : {}));
    } catch(e) {
      return new Error(e);
    }
  }
  
  async Keys(path) {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      return this.get(path).then(values => Object.keys(values ? values : {}));
    } catch(e) {
      return new Error(e);
    }
  }
  
  async Values(path) {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      return this.get(path).then(values => Object.values(values ? values : {}));
    } catch(e) {
      return new Error(e);
    }
  }
  
  async ToJSON(path) {
    if (!this.db) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      return this.get(path).then(i => JSON.stringify(i ? i : {}));
    } catch(e) {
      return new Error(e);
    }
  }
}

module.exports = FirebaseUtil;
