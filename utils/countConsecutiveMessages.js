module.exports.countConsecutiveMessages = function (arr) {
  let consecutiveMessages = [];
  let counter = 1;

  arr.forEach(function (el, i) {
    if (i < arr.length - 1) {
      if (el.sender === arr[i + 1].sender) {
        counter++;
      } else {
        consecutiveMessages.push([counter, el.sender]);
        counter = 1;
      }
    } else {
      consecutiveMessages.push([counter, el.sender]);
    }
  });

  return consecutiveMessages.slice().reverse();
};
