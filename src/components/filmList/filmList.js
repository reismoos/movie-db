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
    totalItems: null,
    sessionId: null,
    starList: {},
    ratedMovieList: [],
    genres: {},
  }

  onMovieLoaded = (movies) => {
    const moviesList = movies.results.map((movie) => ({ ...movie, rating: this.state.starList[movie.id] }))
    this.setState({
      moviesList: moviesList,
      totalItems: movies['total_results'],
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
    if (this.props.tab === 'search') {
      this.movieDB
        .getResource(this.props.searchingMovie, this.state.currentPage)
        .then(this.onMovieLoaded)
        .catch(this.onError)
    } else {
      this.setState({ currentPage: 1 })
      this.movieDB
        .getRatedFilms(this.state.sessionId, this.state.currentPage)
        .then(this.onMovieLoaded)
        .catch(this.onError)
    }
  }

  componentDidMount() {
    this.movieDB
      .createGuestSession()
      .then(this.onGuestSessionCreated)
      .catch((err) => console.log(err))
    this.updateMoviesList()
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.searchingMovie !== prevProps.searchingMovie ||
      this.props.tab !== prevProps.tab ||
      this.state.currentPage !== prevState.currentPage
    ) {
      this.updateMoviesList()
    }
  }

  onChangePage = (page) => {
    this.setState({ currentPage: page })
  }

  onGuestSessionCreated = (response) => {
    this.setState({ sessionId: response.guest_session_id })
  }

  onRateMovie = async (filmId, rate) => {
    await this.movieDB.sendRate(this.state.sessionId, filmId, rate).then((res) => console.log(res))
    this.setState(({ starList }) => ({
      starList: { ...starList, [filmId]: rate },
    }))
  }

  saveGenres = (genres) => {
    this.setState({ genres: genres })
  }

  render() {
    const { loading, error, moviesList } = this.state
    let filmCards =
      moviesList.length > 0 ? (
        moviesList.map((film) => {
          const { id, genre_ids, overview, poster_path, release_date, title, vote_average, rating } = film
          return (
            <FilmCard
              key={id}
              id={id}
              genres={genre_ids}
              description={overview}
              poster={poster_path}
              releaseDate={release_date}
              title={title}
              rating={vote_average}
              onRateMovie={this.onRateMovie}
              starValue={rating}
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
        total={this.state.totalItems}
        pageSize={20}
        showSizeChanger={false}
        responsive={true}
        onChange={this.onChangePage}
        style={{ margin: '15px auto 0', width: '50%' }}
      />
    ) : null
    return (
      <>
        <div className="film-list">
          {spinner}
          {content}
          {errorMessage}
        </div>
        {pagination}
      </>
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
