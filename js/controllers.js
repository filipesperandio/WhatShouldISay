var Expressions = function($firebase, FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL + '/expressions1');
  return $firebase(ref);
};

var Storage = function() {
  var save = function(obj) {
    window.localStorage.setItem('expressions', JSON.stringify(obj));
  };

  var get = function() {
    var expressions =  window.localStorage.getItem('expressions');
    return JSON.parse(expressions);
  };

  return {
    save : save,
    get : get
  };
};

var DashCtrl = function(Expressions, Storage, $timeout) {
  
  Expressions.$on('loaded', function() {
    saveAll();
    Expressions.$on('change', saveAll);
  });

  var saveAll = function() {
    var exp = angular.copy(Expressions, {});
    delete exp.$id;
    Storage.save(exp);
    expressions = Storage.get();
  };

  var expressions = Storage.get();

  var word;

  var random = function() {
    var allExpressions = _.map(expressions, function(each) { return each });
    var index = Math.floor(Math.random() * allExpressions.length);
    word = allExpressions[index];
  };

  var getWord = function() {
    return word;
  };

  var create = function(exp) {
    Expressions.$add(exp);
    exp.value = undefined;
    createDone = true;
    $timeout(function() { 
      createDone = false;
    }, 2000);
  };

  var createDone = false;
  var done = function() {
    console.log('done', createDone);
    return createDone;
  };

  random();

  return {
    random : random,
    word: getWord,
    create : create,
    done : done
  }

};

angular.module('starter.controllers', [ 'firebase', 'ngResource' ])
.constant('FIREBASE_URL', 'https://whatshouldisay.firebaseio.com')
.factory('Expressions', [ '$firebase', 'FIREBASE_URL', Expressions ])
.factory('Storage', [ Storage])
.controller('DashCtrl', [ 'Expressions', 'Storage', '$timeout',  DashCtrl ]);

