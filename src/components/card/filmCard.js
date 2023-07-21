import { Component } from 'react'
import { Card /* Skeleton */, Typography } from 'antd'
import format from 'date-fns/format'
import './filmCard.css'

const { Meta } = Card
const { Text, Paragraph } = Typography
export default class FilmCard extends Component {
  state = {
    loading: true,
  }

  render() {
    const { genres, description, poster, releaseDate, title } = this.props
    return (
      <>
        <Card
          style={{
            width: 451,
            height: 282,
          }}
          bordered={false}
          bodyStyle={{ boxShadow: 'none' }}
        >
          <Meta
            className="dfdfd"
            avatar={
              <img
                src={
                  poster
                    ? 'https://image.tmdb.org/t/p/original' + poster
                    : 'https://63dp.ru/local/templates/aspro-stroy/images/noimage_detail.png'
                }
                alt={title}
                width={183}
                height={279}
              />
            }
            title={title}
            description={<FilmInfo genres={genres} description={description} releaseDate={releaseDate} />}
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
  const { genres, description, releaseDate } = props
  const date = releaseDate ? format(new Date(releaseDate), 'MMMM dd, yyyy') : 'unknown'
  return (
    <>
      <Paragraph type="secondary">{date}</Paragraph>
      <Text keyboard>{genres[0]}</Text>
      <Paragraph style={{ marginTop: 10, paddingRight: 10 }}>{cutText(description)}</Paragraph>
    </>
  )
}

FilmInfo.defaultProps = {
  genres: ['drama'],
  releaseDate: '2011-02-10',
}
