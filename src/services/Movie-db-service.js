export default class MovieDbService {
  _oprions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOGM2ZGIxMDBkYTZmOGFmZTVhNjU2ZjM3MTU1ZWYwYyIsInN1YiI6IjY0YjEyNDMyNGU0ZGZmMDBmZmQwZTM2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.J6XvQByfBDS8zThh2ifhcPQgIAcDK3DyxSR5CO3TC1w',
    },
  }

  getResource = async (film, page) => {
    let res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${film}&page=${page}`, this._oprions)

    if (!res.ok) {
      throw new Error(
        `Could not fetch https://api.themoviedb.org/3/search/movie?query=${film}&page=${page}, status: ${res.status}`
      )
    }

    return await res.json()
  }
}
