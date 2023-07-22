import { Component } from 'react'
import debounce from 'lodash.debounce'

import FilmList from '../filmList/filmList'
import SearchForm from '../searchForm/searchForm'

import './App.css'

export default class App extends Component {
  state = {
    searchingMovie: 'return',
  }

  onSearchChange = debounce((e) => {
    this.setState({ searchingMovie: e.target.value })
  }, 2000)

  render() {
    return (
      <div className="movie-app">
        <SearchForm onSearchChange={this.onSearchChange} />
        <FilmList searchingMovie={this.state.searchingMovie} />
      </div>
    )
  }
}
