import { Component } from 'react'
import { Spin, Alert, Space, Pagination } from 'antd'

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
    this.movieDB
      .getResource(this.props.searchingMovie, this.state.currentPage)
      .then(this.onMovieLoaded)
      .catch(this.onError)
  }

  componentDidMount() {
    this.updateMoviesList()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.searchingMovie !== prevProps.searchingMovie) {
      this.updateMoviesList()
    }
    if (prevState.currentPage !== this.state.currentPage) {
      this.updateMoviesList()
    }
  }

  onChangePage = (page) => {
    this.setState({ currentPage: page })
  }

  render() {
    const { loading, error, moviesList } = this.state
    let filmCards =
      moviesList.length > 0 ? (
        moviesList.map((film) => {
          const { id, genre_ids, overview, poster_path, release_date, title } = film
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
      ) : (
        <Alert message="Movie not found" type="info" showIcon style={{ margin: '0 auto' }} />
      )

    const errorMessage = error ? <ErrorMessage /> : null
    const spinner = loading ? <Spin size={'large'} style={{ margin: '0 auto' }} /> : null
    const content = !(loading || error) ? filmCards : null
    const pagination = !(loading || error || moviesList.length === 0) ? (
      <Pagination
        current={this.state.currentPage}
        total={this.state.totalPages}
        showSizeChanger={false}
        onChange={this.onChangePage}
        style={{ margin: '0 auto' }}
      />
    ) : null
    console.log(this.state.totalPages)
    return (
      <div className="film-list">
        {spinner}
        {content}
        {errorMessage}
        {pagination}
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
