self.addEventListener('message', (event) => {
  console.log('dummy service worker running', event.data);
});
