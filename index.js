'use strict';

const { initializeApp: init, database } = require('firebase'),
  SymbolDB = Symbol('Firebase');

class FirebaseUtil {
  constructor(options) {
    if (!global.firebaseConnect && typeof options !== 'object') return new TypeError('O dados tem que estar em objeto!');
    if (!global.firebaseConnect && !options.apiKey) return new TypeError('apiKey é obrigatória, defina ela!');
    if (!global.firebaseConnect && !options.databaseURL) return new TypeError('databaseURL é obrigatória, defina ela!');
    
    this.version = require('./package.json').version;
    this.get = this.Get;
    this.set = this.Set;
    this.has = this.Has;
    this.all = this.All;
    this.ping = this.Ping;
    this.push = this.Push;
    this.keys = this.Keys;
    this.math = this.Math;
    this.del = this.Delete;
    this.upd = this.Update;
    this.values = this.Values;
    this.toJSON = this.ToJSON;
    this.entries = this.Entries;
    this.transaction = this.Transaction;
    this[SymbolDB] = connect(options);
    
    function connect(options) {
      try {
        if (global.firebaseConnect) return database();
        global.firebaseConnect = true;
        return init(options).database();
      } catch (err) {
        return new Error('Erro ao conectar ao banco de dados.', err);
      }
    }
  }
  
  async Ping() {
    if (!this[SymbolDB]) return new Error('O banco de dados não está conectado para executar esta ação!');
    let date = Date.now();
    try {
      return await this[SymbolDB].ref('FirebaseUtil')
      .once('value').then(() => Date.now() - date);
    } catch(err) {
      return new Error(err);
    }
  }
  
  async Get(path) {
    if (!this[SymbolDB]) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      return await this[SymbolDB].ref(path)
      .once('value').then(i => i.val());
    } catch(err) {
      return new Error(err);
    }
  }
  
  async Set(path, value) {
    if (!this[SymbolDB]) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    if (!value) return new TypeError('Você não definiu um valor!');
    try {
      await this[SymbolDB].ref(path).set(value);
      return value;
    } catch(err) {
      return new Error(err);
    }
  }
  
  async Delete(path) {
    if (!this[SymbolDB]) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    try {
      await this[SymbolDB].ref(path).remove();
      return true;
    } catch(err) {
      return new Error(err);
    }
  }
  
  async Update(path, value) {
    if (!this[SymbolDB]) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    if (!value) return new TypeError('Você não definiu um valor!');
    if (typeof value !== 'object') return new TypeError('O valor deve ser um objeto!');
    try {
      await this[SymbolDB].ref(path).update(value);
      return value;
    } catch(err) {
      return new Error(err);
    }
  }
  
  async Has(path) {
    if (!this[SymbolDB]) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      let value = await this.get(path);
      if (!value) return false;
      else return true;
    } catch(err) {
      return new Error(err);
    }
  }
  
  async Math(path, simbol, value) {
    if (!this[SymbolDB]) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    if (!simbol) return new TypeError('Você não definiu um operador válido. Operadores: +, -, / e *.');
    if (typeof simbol !== 'string') return new TypeError('Você não definiu um operador válido. Operadores: +, -, / e *.');
    if (!value) return new TypeError('Você não definiu um valor!');
    if (isNaN(value)) return new TypeError('O valor definido não é um número!');
    try {
      switch (simbol) {
        case '+':
          return await this.transaction(path, res => (
            String(Number(res ? res : 0) + Number(value))
          ));
          break;
        case '-':
          return await this.transaction(path, res => (
            String(Number(res ? res : 0) - Number(value))
          ));
          break;
        case '/':
          return await this.transaction(path, res => (
            String(Number(res ? res : 0) / Number(value))
          ));
          break;
        case '*':
          return await this.transaction(path, res => (
            String(Number(res ? res : 0) * Number(value))
          ));
          break;
        default:
          throw new TypeError('Você não definiu um operador válido. Operadores: +, -, / e *.');
          break
      }
    } catch (err) {
      return new Error(err);
    }
  }
  
  async Transaction(path, callback) {
    if (!this[SymbolDB]) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    if(!callback) return new TypeError('Você precisa inserir uma função de callback!');
    if(typeof callback !== 'function') return new TypeError('O parâmetro callback precisa ser uma função!');
    try {
      let 
        val = await this.get(path),
        callResult = await callback(val);
      return await this.set(path, callResult);
    } catch(err) {
      return new Error(err);
    }
  }
  
  async All() {
    if (!this[SymbolDB]) return new Error('O banco de dados não está conectado para executar esta ação!');
    try {
      return await this.get('/');
    } catch(err) {
      return new Error(err);
    }
  }
  
  async Push(path, values) {
    if (!this[SymbolDB]) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    if (!values) return new TypeError('Você não definiu um valor!');
    try {
      let val = await this.get(path);
      if (!Array.isArray(val)) val = [];
      values = Array.isArray(values) ? values : [values];
      val.push(...values);
      await this.set(path, val);
      return val;
    } catch(err) {
      return new Error(err);
    }
  }
  
  async Entries(path) {
    if (!this[SymbolDB]) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      return this.get(path).then(values => Object.entries(values ? values : {}));
    } catch(err) {
      return new Error(err);
    }
  }
  
  async Keys(path) {
    if (!this[SymbolDB]) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      return this.get(path).then(values => Object.keys(values ? values : {}));
    } catch(err) {
      return new Error(err);
    }
  }
  
  async Values(path) {
    if (!this[SymbolDB]) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      return this.get(path).then(values => Object.values(values ? values : {}));
    } catch(err) {
      return new Error(err);
    }
  }
  
  async ToJSON(path) {
    if (!this[SymbolDB]) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      return this.get(path).then(i => JSON.stringify(i ? i : {}));
    } catch(err) {
      return new Error(err);
    }
  }
}

module.exports = FirebaseUtil;