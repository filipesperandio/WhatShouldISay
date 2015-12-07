function LoadingSpinner () {
  var opts = {
    lines: 9 // The number of lines to draw
    , length: 15 // The length of each line
    , width: 8 // The line thickness
    , radius: 15 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
  };
  var _target = document.getElementById('spinner');
  var spinner = new Spinner(opts).spin(_target);

  return spinner;
};

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
  var spinner = LoadingSpinner();

  Expressions.$on('loaded', function() {
    saveAll();
    random();
    Expressions.$on('change', saveAll);
    spinner.stop();
  });

  var saveAll = function() {
    var exp = angular.copy(Expressions, {});
    delete exp.$id;
    Storage.save(exp);
  };

  var word;

  var random = function() {
    var allExpressions = _.map(Storage.get(), function(value, key) { return _.extend(value, {"key": key}); });
    var index = Math.floor(Math.random() * allExpressions.length);
    word = allExpressions[index];
  };

  var once = false;
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
    return createDone;
  };

  var like = function() {
    var item = Expressions.$child(word.key);
    var likes = item.likes || 0;
    likes++;
    item.$update({"likes":likes});
    word.likes = likes;
  };

  var dislike = function() {
    var item = Expressions.$child(word.key);
    var dislikes = item.dislikes || 0;
    dislikes++;
    item.$update({"dislikes":dislikes});
    word.dislikes = dislikes;
  };

  return {
    random : random,
    word: getWord,
    create : create,
    done : done,
    like : like,
    dislike : dislike
  }

};

angular.module('starter.controllers', [ 'firebase', 'ngResource' ])
.constant('FIREBASE_URL', 'https://whatshouldisay.firebaseio.com')
.factory('Expressions', [ '$firebase', 'FIREBASE_URL', Expressions ])
.factory('Storage', [ Storage])
.controller('DashCtrl', [ 'Expressions', 'Storage', '$timeout',  DashCtrl ]);
