export function updateImageAlts() {

  function element(tagName) {
    document.createElement(name);
  }

  function append(target, node) {
    target.appendChild(node);
  }

  function listen(node, event, handler) {
    node.addEventListener(event, handler);
    return () => node.removeEventListener(event, handler);
  }

  function detach(node) {
    node.parentNode.removeChild(node);
  }

  const api = {
    fetchRandomWords(imageNumber) {
      return fetch('https://random-word-api.herokuapp.com/word?number='+ imageNumber)
        .then((data) => data.json()
        .catch((err) => console.log(err)));
    }
  }

  // get list of all img tag elements
  let imgElements = document.getElementsByTagName('img');

  let input;
  let dispose;

  const createInput = (value, position) => {
    const input = document.createElement('input');
    input.style.position = 'absolute';
    input.style.zIndex = '999999';
    input.value = value;
    input.style.top = position.y + 'px';
    input.style.left = position.x + 'px';
    return input;
  }

  const updateImageNodes = (nodes, randomWords) => {
    if (nodes.length != randomWords.length) {
      console.log('nodes and randomWords should be the same length');
      return;
    }

    for (let i = 0; i < nodes.length; i++) {
      const imgEl = nodes[i];
      imgEl.alt = randomWords[i];
      imgEl.style.boxSizing = 'border-box';
      imgEl.style.border = '6px solid #f542e6';

      imgEl.addEventListener('contextmenu', (event) => {
        event.preventDefault();

        if (input) {
          detach(input);
          dispose(input);
        }

        input = createInput(imgEl.alt, {x: event.pageX, y: event.pageY});
        append(document.body, input);
        dispose = listen(input, 'input', (e) => {
          imgEl.alt = e.target.value;
        });

      })

      listen(imgEl, 'click', () => {
        if (input) {
          detach(input);
          dispose(input);
          input = null;
        }
      })
    }
  }

  if (imgElements.length > 0) {
    api.fetchRandomWords(imgElements.length)
      .then((randomWords) => {
        updateImageNodes(imgElements, randomWords);
      });
  }

  const filterImageNodes = (nodes) => {
    const result = [];
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].tagName === 'IMG') {
        result.push(nodes[i]);
      }
    }
    return result;
  }

  const observer = new MutationObserver((mutations) => {
    if (mutations.length === 0) return;

    for (let i = 0; i < mutations.length; i++) {
      const mutationRecord = mutations[i];

      const images = filterImageNodes(mutationRecord.addedNodes);
      if (images.length > 0) {
        api.fetchRandomWords(images.length)
          .then((randomWords) => {
            updateImageNodes(images, randomWords);
          })
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    attributes: false,
    subtree: true
  });
}
