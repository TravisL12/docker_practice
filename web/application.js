const data = {
  description: "I love food",
  payee: "else something",
};

fetch("http://0.0.0.0:5005/seed", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
})
  .then((resp) => resp.json())
  .then(({ data }) => {
    console.log(data, "from the server");
  });
