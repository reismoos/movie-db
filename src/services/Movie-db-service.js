export default class MovieDbService {
  _baseUrl = 'https://api.themoviedb.org'
  _apiKey = 'api_key=b8c6db100da6f8afe5a656f37155ef0c'

  createGuestSession = async () => {
    let res = await fetch(`${this._baseUrl}/3/authentication/guest_session/new?${this._apiKey}`)
    if (!res.ok) {
      throw new Error('failed create new guest session')
    }

    return await res.json()
  }

  sendRate = async (sessionId, filmId, rate) => {
    let options = {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: JSON.stringify({ value: rate }),
    }

    let s = fetch(`${this._baseUrl}/3/movie/${filmId}/rating?guest_session_id=${sessionId}&${this._apiKey}`, options)
      .then((response) => response.json())
      .catch((err) => console.error(err))
    return s
  }

  getRatedFilms = async (sessionId, page = 1) => {
    let res = await fetch(`${this._baseUrl}/3/guest_session/${sessionId}/rated/movies?${this._apiKey}&&page=${page}`)
    if (!res.ok) {
      throw new Error('failed getting rated films')
    }

    return await res.json()
  }

  getResource = async (film, page = 1) => {
    let res = await fetch(`${this._baseUrl}/3/search/movie?query=${film}&page=${page}&${this._apiKey}`)

    if (!res.ok) {
      throw new Error(
        `Could not fetch ${this._baseUrl}/3/search/movie?query=${film}&page=${page}, status: ${res.status}`
      )
    }

    return await res.json()
  }

  getGenres = async () => {
    let genres = await fetch(`${this._baseUrl}/3/genre/movie/list?${this._apiKey}`)
    if (!genres.ok) {
      throw new Error(`${this._baseUrl}/3/genre/movie/list?${this._apiKey}, status: ${genres.status}`)
    }
    let genresArr = await genres.json()
    console.log(genresArr)
    let result = {}
    await genresArr.genres.forEach((el) => (result[el.id] = el.name))

    return result
  }
}
