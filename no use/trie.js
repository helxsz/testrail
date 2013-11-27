/**
 * trie.js
 * A simple trie to suggest frequent phrases
 */
var redis = require('redis').createClient();
 
// Default constructor
var Trie = function(trieName) {
    this.root = 'trie';
    this.separator = '->';
};
exports.Trie = Trie;
 
// Stores a search phrase
Trie.prototype.addPhrase = function(phrase) {
    var key = this.root;
    var words = phrase.split(' ');
    for(var index in words) {
        var word = words[index].toLowerCase();
        this.addWord(word, key);
        key = (key + this.separator + word);
    }
};
 
// Stores a word as a child of given key
Trie.prototype.addWord = function(word, key) {
    var parent = key || this.root;
    // var score = word.charCodeAt(0);
    // redis.zadd(parent, score, word);
    redis.zincrby(parent, 1, word);
};
 
// Suggests a next word based on the input
Trie.prototype.suggest = function(phrase, callback) {
    var prefix = this.root + this.separator;
    var path = phrase.toLowerCase().split(' ').join(this.separator);
    var key = prefix + path;
    redis.zrevrangebyscore(key, '+inf', '-inf', callback);
};
 
// Disconnect from redis
Trie.prototype.end = function() {
    redis.quit();
};
//- See more at: http://www.vijaykandy.com/2012/03/autocomplete-using-a-trie-in-redis/#sthash.uYKgvLYN.dpuf