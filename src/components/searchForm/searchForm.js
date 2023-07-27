import { Component } from 'react'
import { Input } from 'antd'

export default class SearchForm extends Component {
  state = {
    search: '',
  }

  render() {
    return (
      <Input
        placeholder="Basic usage"
        onChange={this.props.onSearchChange}
        style={{ marginRight: 20 }}
        value={this.props.searchingValuet}
      />
    )
  }
}
