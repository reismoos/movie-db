export default class MovieDbService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/'
  _apiKey = 'apikey=5e309df05f9963f969df838d5771649c'
  _oprions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOGM2ZGIxMDBkYTZmOGFmZTVhNjU2ZjM3MTU1ZWYwYyIsInN1YiI6IjY0YjEyNDMyNGU0ZGZmMDBmZmQwZTM2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.J6XvQByfBDS8zThh2ifhcPQgIAcDK3DyxSR5CO3TC1w',
    },
  }

  s = 'https://api.themoviedb.org/3/search/movie?query=return'

  getResource = async (film, page) => {
    let res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${film}&page=${page}`, this._oprions)

    if (!res.ok) {
      throw new Error(
        `Could not fetch https://api.themoviedb.org/3/search/movie?query=${film}&page=${page}, status: ${res.status}`
      )
    }

    return await res.json()
  }

  getAllCharacters = async (offset = this._baseOffSet) => {
    const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`)
    return res.data.results.map(this._transformCharacter)
  }

  getCharacter = async (id) => {
    const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`)
    return this._transformCharacter(res.data.results[0])
  }

  _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description
        ? `${char.description.slice(0, 210)}...`
        : 'There is no description for this character',
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    }
  }
}
