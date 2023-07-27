import { Component } from 'react'
import debounce from 'lodash.debounce'
import { Tabs } from 'antd'

import FilmList from '../filmList/filmList'
import SearchForm from '../searchForm/searchForm'
import { MovieProvider } from '../../context/context'
import MovieDbService from '../../services/Movie-db-service'

import './App.css'

export default class App extends Component {
  state = {
    searchingMovie: 'return',
    tab: 'search',
    genres: {},
  }

  movieDB = new MovieDbService()

  onSearchChange = debounce((e) => {
    this.setState({ searchingMovie: e.target.value })
  }, 500)

  onChangeTab = (key) => {
    this.setState({ tab: key })
  }

  componentDidMount() {
    this.movieDB.getGenres().then(this.saveGenres)
  }

  saveGenres = (genres) => {
    this.setState({ genres: genres })
  }

  render() {
    const searchBar =
      this.state.tab === 'search' ? (
        <SearchForm onSearchChange={this.onSearchChange} searchingValue={this.state.searchingMovie} />
      ) : null
    return (
      <div className="movie-app" style={{ paddingBottom: 15 }}>
        <Tabs
          defaultActiveKey="1"
          centered
          onChange={this.onChangeTab}
          items={[
            { label: 'Search', key: 'search' },
            { label: 'Rated', key: 'rated' },
          ]}
        />
        {searchBar}

        <MovieProvider value={this.state.genres}>
          <FilmList searchingMovie={this.state.searchingMovie} tab={this.state.tab} />
        </MovieProvider>
      </div>
    )
  }
}
