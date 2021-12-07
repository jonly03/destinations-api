function generateUniqueId() {
  // "123456"
  let id = "";

  for (let index = 0; index < 6; index++) {
    const randNumber = Math.floor(Math.random() * 9) + 1;

    id += randNumber;
  }

  return id;
}

async function getUnsplashPhoto({ name, location }) {
  const UNSPLASH_URL = `https://api.unsplash.com/photos/random?client_id=ZUAPn3ODLz7xSJEa_kQZY4B2kfKSccXz6f3jBytjcGE&query=${name} ${location}`;

  const fetchRes = await fetch(UNSPLASH_URL);
  const data = await fetchRes.json();

  return data.urls.small;
}

module.exports = { generateUniqueId, getUnsplashPhoto };
