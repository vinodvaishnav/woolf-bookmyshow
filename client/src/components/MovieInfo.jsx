import React from 'react';
import { Card, Row, Col, Typography, Space, Avatar, Rate } from 'antd';
import { formatDuration, formatDate } from "../util/data_format";

const { Title, Text, Paragraph } = Typography;

const MovieInfo = ({ movieDetail }) => {
    return (
        <div className="movie-content">
            <div className="container">
                <Row gutter={[32, 32]}>
                    <Col xs={24} lg={16}>
                        {/* Synopsis */}
                        <Card className="movie-synopsis" style={{ marginBottom: '24px' }}>
                            <Title level={3}>About the Movie</Title>
                            <Paragraph
                                ellipsis={{ rows: 4, expandable: true, symbol: 'Read more' }}
                                style={{ fontSize: '16px', lineHeight: '1.6' }}
                            >
                                {movieDetail.description || 'No description available for this movie.'}
                            </Paragraph>
                        </Card>

                        {/* Cast & Crew */}
                        {movieDetail.cast && movieDetail.cast.length > 0 && (
                            <Card className="movie-cast" style={{ marginBottom: '24px' }}>
                                <Title level={3}>Cast</Title>
                                <div className="cast-list">
                                    <Space wrap size="large">
                                        {movieDetail.cast.map((actor, index) => (
                                            <div key={index} className="cast-member">
                                                <Avatar size={64} style={{ backgroundColor: '#f00865' }}>
                                                    {actor.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Text style={{ display: 'block', textAlign: 'center', marginTop: '8px' }}>
                                                    {actor}
                                                </Text>
                                            </div>
                                        ))}
                                    </Space>
                                </div>
                            </Card>
                        )}

                        {/* Reviews */}
                        <Card className="movie-reviews">
                            <Title level={3}>Reviews & Ratings</Title>
                            <div className="reviews-section">
                                <div className="overall-rating">
                                    <Rate disabled defaultValue={movieDetail.imdbRating ? Math.round(movieDetail.imdbRating / 2) : 0} />
                                    <Text strong style={{ marginLeft: '8px' }}>
                                        {movieDetail.imdbRating || 'N/A'}/10
                                    </Text>
                                    {movieDetail.imdbComment && (
                                        <Text style={{ display: 'block', marginTop: '4px', color: '#666' }}>
                                            {movieDetail.imdbComment}
                                        </Text>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        {/* Movie Stats */}
                        <Card className="movie-stats" title="Movie Info">
                            <div className="stats-list">
                                {movieDetail.duration && (
                                    <div className="stat-item">
                                        <Text strong>Duration:</Text>
                                        <Text>{formatDuration(movieDetail.duration)}</Text>
                                    </div>
                                )}
                                {movieDetail.releaseDate && (
                                    <div className="stat-item">
                                        <Text strong>Release Date:</Text>
                                        <Text>{formatDate(movieDetail.releaseDate)}</Text>
                                    </div>
                                )}
                                {movieDetail.genres && (
                                    <div className="stat-item">
                                        <Text strong>Genre:</Text>
                                        <Text>{movieDetail.genres}</Text>
                                    </div>
                                )}
                                {movieDetail.languages && (
                                    <div className="stat-item">
                                        <Text strong>Language:</Text>
                                        <Text>{movieDetail.languages.join(', ')}</Text>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default MovieInfo;