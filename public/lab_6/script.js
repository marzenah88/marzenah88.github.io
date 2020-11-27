function range(int) {
  const arr = [];
  for (let i = 0; i < int; i += 1) {
    arr.push(i);
  }
  return arr;
}

function sortFunction(a, b, key) {
  if (a[key] < b[key]) {
    return -1;
  } if (a[key] > b[key]) {
    return 1;
  }
  return 0;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

document.body.addEventListener('submit', async (e) => {
  e.preventDefault(); // this stops whatever the browser wanted to do itself.
  const form = $(e.target).serializeArray(); // here we're using jQuery to serialize the form
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  })
    .then((fromServer) => fromServer.json())
    .then((fromServer) => {
      // You're going to do your lab work in here. Replace this comment
      if (document.querySelector('.flex-inner')) { 
        document.querySelector('.flex-inner').remove();
      }
      const dataLength = fromServer.length;
      const countries = range(10);
      const indexes = range(10)
      const arrOf10 = countries.map(() => {
        let num = 0;
        do {
          num = getRandomInt(dataLength);
        } while (num in indexes);
        indexes.push(num);
        return fromServer[num];
      });
      const selected = document.createElement('ol');
      selected.className = 'flex-inner';
      $('form').prepend(selected);

      const inputList = arrOf10.sort((a, b) => sortFunction(a, b, 'name'));
      inputList.reverse();
      inputList.forEach(el => {
        const li = document.createElement('li');
        $(li).append(`<input type='checkbox' id= ${el.code} value=${el.code} />`);
        $(li).append(`<label for=${el.code}>${el.name}</label>`);
        $(selected).append(li);
      });
    }).catch((err) => console.log(err));
});