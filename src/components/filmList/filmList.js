import { Component } from 'react'
import { Spin, Alert, Space } from 'antd'

import MovieDbService from '../../services/Movie-db-service'
import FilmCard from '../card/filmCard'
import './filmList.css'

export default class FilmList extends Component {
  state = {
    moviesList: [],
    loading: true,
    error: false,
    currentPage: 1,
    totalPages: null,
  }

  onMovieLoaded = (movies) => {
    this.setState({
      moviesList: movies.results,
      totalPages: movies['total_pages'],
      loading: false,
    })
  }

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    })
  }

  onLoading = () => {
    this.setState({
      loading: true,
    })
  }

  movieDB = new MovieDbService()
  updateMoviesList = () => {
    this.onLoading()
    this.movieDB.getResource('return', 1).then(this.onMovieLoaded).catch(this.onError)
  }

  componentDidMount() {
    this.updateMoviesList()
  }

  render() {
    const { loading, error, moviesList } = this.state
    const filmCards = moviesList.map((film) => {
      const { id, genre_ids, overview, poster_path, release_date, title } = film
      console.log(id)
      return (
        <FilmCard
          key={id}
          genres={genre_ids}
          description={overview}
          poster={poster_path}
          releaseDate={release_date}
          title={title}
        />
      )
    })
    const errorMessage = error ? <ErrorMessage /> : null
    const spinner = loading ? <Spin size={'large'} style={{ margin: '0 auto' }} /> : null
    const content = !(loading || error) ? filmCards : null
    return (
      <div className="film-list">
        {spinner}
        {content}
        {errorMessage}
      </div>
    )
  }
}

const ErrorMessage = () => {
  return (
    <Space
      direction="vertical"
      style={{
        width: '100%',
      }}
    >
      <Alert message="Error" description="Something gone wrong. Try again later" type="error" showIcon />
    </Space>
  )
}
