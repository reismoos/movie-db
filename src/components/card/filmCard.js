import { Component } from 'react'
import { Card, Rate, Typography } from 'antd'
import format from 'date-fns/format'

import { MovieConsumer } from '../../context/context'
import './filmCard.css'

const { Meta } = Card
const { Text, Paragraph } = Typography
export default class FilmCard extends Component {
  state = {
    loading: true,
  }

  onChangeStarValue = async (value) => {
    console.log(value, 'startCalue')
    await this.props.onRateMovie(this.props.id, value)
  }

  render() {
    console.log(this.props.myRating, 'myre')
    const { genres, description, poster, releaseDate, title, rating, starValue, id } = this.props
    return (
      <>
        <Card
          style={{
            boxShadow: 'none',
          }}
          bordered={false}
        >
          <Meta
            avatar={
              <img
                src={
                  poster
                    ? 'https://image.tmdb.org/t/p/original' + poster
                    : 'https://63dp.ru/local/templates/aspro-stroy/images/noimage_detail.png'
                }
                alt={title}
              />
            }
            title={title}
            description={
              <FilmInfo
                genres={genres}
                description={description}
                releaseDate={releaseDate}
                starValue={starValue}
                onChangeStarValue={this.onChangeStarValue}
                rating={rating}
                id={id}
              />
            }
          />
        </Card>
      </>
    )
  }
}

const cutText = (text) => {
  if (text.length > 200) {
    return text.slice(0, text.indexOf(' ', 190)) + '...'
  }
  return text
}

const FilmInfo = (props) => {
  const { description, releaseDate, starValue, onChangeStarValue, rating, genres } = props
  const date = releaseDate ? format(new Date(releaseDate), 'MMMM dd, yyyy') : 'unknown'

  function ratingBorderColor(rating) {
    if (rating < 3) {
      return '#E90000'
    } else if (rating < 5) {
      return '#E97E00'
    } else if (rating < 7) {
      return '#E9D100'
    }
    return '#66E900'
  }

  function renderGenres(genresArr, filmGenresArr) {
    if (filmGenresArr.length === 0) {
      return (
        <Text keyboard key={1}>
          Unknown
        </Text>
      )
    }
    let result = filmGenresArr.map((genre) => (
      <Text keyboard key={genre}>
        {genresArr[genre]}
      </Text>
    ))

    return <div className="film-genres">{result}</div>
  }
  return (
    <MovieConsumer>
      {(genresArr) => (
        <>
          <Paragraph type="secondary">{date}</Paragraph>
          {renderGenres(genresArr, genres)}
          <Paragraph style={{ marginTop: 10, paddingRight: 10, position: 'relative' }} className="film-description">
            {cutText(description)}
          </Paragraph>
          <Rate
            allowHalf
            defaultValue={starValue}
            count={10}
            onChange={onChangeStarValue}
            style={{ position: 'absolute', bottom: 10 }}
          />
          <div className="film-card__rating" style={{ borderColor: ratingBorderColor(rating) }}>
            <p>{rating.toFixed(1)}</p>
          </div>
        </>
      )}
    </MovieConsumer>
  )
}

FilmInfo.defaultProps = {
  genres: ['drama'],
  releaseDate: '2011-02-10',
}
