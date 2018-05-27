const SHA256 = require('crypto-js/sha256');
const cryptoRandomString = require('crypto-random-string');

class Block {
  constructor(data) {
    this.nonce = 0;
    this.data = data;
    this.previousHash = '';
    this.timeCreated = Date.now(); //+ performance.now();
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return (
      SHA256(
        this.nonce
        + JSON.stringify(this.data)
        + this.previousHash
        + this.timeCreated
      ).toString()
    );
  }
}

class Blockchain {
  constructor(difficulty, entropy) {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty;
    this.entropy = entropy;
    this.hash = this.calculateHash();
  }

  createGenesisBlock() {
    return new Block("0001 0001 0010 0011 0101 1000 1101");
  }

  calculateHash() {
    return SHA256(this.chain).toString();
  }

  getLatestBlock() {
    return this.chain.slice(-1)[0];
  }

  mineBlock(block) {
    let attempts = 1;
    block.nonce = this.entropy(attempts);
    block.previousHash = this.getLatestBlock().hash;
    block.hash = block.calculateHash();
    console.log(`Mining block ${this.chain.length}...`);
    while (block.hash[0] != ('7'.repeat(this.difficulty))) {
      attempts++;
      block.nonce = this.entropy(attempts);
      block.hash = block.calculateHash();
    }
    console.log(`Block mined after ${attempts} attempts:`, block.hash);
    this.chain.push(block);
  }

  isChainValid(start=1, end=this.chain.length) {
    if (this.hash !== this.calculateHash()) { return false; }
    if (this.chain[start] == undefined || this.chain[end-1] == undefined) {
      console.log("Invalid start or end");
    }
    for (let i = start; i < end; i++) {
      let currentBlock = this.chain[i];
      let previousBlock = this.chain[i-1];
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

let popchain = new Blockchain(diffculty=1, entropy=cryptoRandomString);
popchain.mineBlock(new Block({ NY: 19378102 }));
popchain.mineBlock(new Block({ CA: 37253956 }));
console.log('The chain is valid:', popchain.isChainValid());
//console.log(JSON.stringify(popchain, null, 2));


