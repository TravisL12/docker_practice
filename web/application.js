fetch('http://0.0.0.0:5001/')
  .then((resp) => resp.json())
  .then(({ data }) => {
    console.log(data, 'from the server');
  });
