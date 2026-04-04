import { formatDuration, formatDate } from '../util/data_format';
import { Button, Col, Image, Row, Space, Tag, Typography } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, GlobalOutlined, PlayCircleOutlined, StarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const MovieHero = ({ movieDetail, bookingHandler = () => { } }) => {
    return (
        <div
            className="movie-hero"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${movieDetail.poster})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="movie-hero-content">
                <Row gutter={[32, 16]} align="middle">
                    <Col xs={24} md={8} lg={6}>
                        <div className="movie-poster">
                            <Image
                                src={movieDetail.thumbnail}
                                alt={movieDetail.name}
                                preview={false}
                                style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                            />
                        </div>
                    </Col>
                    <Col xs={24} md={16} lg={18}>
                        <div className="movie-info">
                            <Title level={1} style={{ color: 'white', marginBottom: '8px' }}>
                                {movieDetail.name}
                            </Title>

                            <Space size="large" style={{ marginBottom: '16px' }}>
                                {movieDetail.imdbRating && (
                                    <div className="rating">
                                        <StarOutlined style={{ color: '#fadb14', marginRight: '4px' }} />
                                        <Text strong style={{ color: 'white' }}>
                                            {movieDetail.imdbRating}/10
                                        </Text>
                                    </div>
                                )}

                                {movieDetail.duration && (
                                    <div className="duration">
                                        <ClockCircleOutlined style={{ marginRight: '4px', color: 'white' }} />
                                        <Text style={{ color: 'white' }}>
                                            {formatDuration(movieDetail.duration)}
                                        </Text>
                                    </div>
                                )}

                                {movieDetail.releaseDate && (
                                    <div className="release-date">
                                        <CalendarOutlined style={{ marginRight: '4px', color: 'white' }} />
                                        <Text style={{ color: 'white' }}>
                                            {formatDate(movieDetail.releaseDate)}
                                        </Text>
                                    </div>
                                )}
                            </Space>

                            <div className="movie-meta" style={{ marginBottom: '16px' }}>
                                {movieDetail.genres && (
                                    <div style={{ marginBottom: '8px' }}>
                                        <Text strong style={{ color: 'white' }}>Genre: </Text>
                                        <Tag color="magenta">{movieDetail.genres}</Tag>
                                    </div>
                                )}

                                {movieDetail.languages && movieDetail.languages.length > 0 && (
                                    <div style={{ marginBottom: '8px' }}>
                                        <Text strong style={{ color: 'white' }}>Languages: </Text>
                                        {movieDetail.languages.map(lang => (
                                            <Tag key={lang} color="blue" style={{ marginRight: '4px' }}>
                                                <GlobalOutlined style={{ marginRight: '4px' }} />
                                                {lang}
                                            </Tag>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="movie-actions">
                                <Space>
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<PlayCircleOutlined />}
                                        style={{ backgroundColor: '#f00865', borderColor: '#f00865' }}
                                    >
                                        Watch Trailer
                                    </Button>
                                    <Button size="large" type="default" onClick={bookingHandler}>
                                        Book Ticket
                                    </Button>
                                </Space>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default MovieHero;
