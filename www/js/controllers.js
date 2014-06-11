angular.module('starter.controllers', [])

.controller('DashCtrl', function() {

  var expresions = [
    "Wow, you are so smart!",
    "You wanna medal!!!",
    "I like squash! Do you???",
    "Cool story bro!",
    "I think it's gonna rain today!",
    "How about that local sports team?",
    "Was your mother proud of you?",
    "You should tell your mom",
    "There's an app for that",
    "Hold on, let me refer to my social dictionary!",
    "Let's make an app for that!",
    "Are you a genius?",
    "Let's google that"
  ];

  var word;

  var random = function() {
    var index = Math.floor((Math.random() * (expresions.length - 1)));
    word = expresions[index];
  };

  var getWord = function() {
    return word;
  };

  random();

  return {
    random : random,
    word: getWord
  }
  
})

