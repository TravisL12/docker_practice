export async function getData() {
  let url = "http://0.0.0.0:5005/spending";
  const resp = await fetch(url);
  const { data } = await resp.json();
  return data;
}

export async function searchData(query = "") {
  let url = `http://0.0.0.0:5005/search?likeQuery=${query}`;
  const resp = await fetch(url);
  const { data } = await resp.json();
  return data;
}

export async function addData(rows) {
  try {
    const req = await fetch("http://0.0.0.0:5005/spending/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rows),
    });
    const parseReq = await req.json();
    return parseReq;
  } catch (err) {
    console.log(err);
    return "err";
  }
}
