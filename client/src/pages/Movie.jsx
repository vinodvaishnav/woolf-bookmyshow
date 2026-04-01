import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Image, Button, Card, Row, Col, Tag, Rate, Divider, Typography, Space, Avatar } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, GlobalOutlined, StarOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { getMovieDetail, getMovieShows } from "../redux/movieSlice";

const { Title, Text, Paragraph } = Typography;

const Movie = () => {
    const { id: movieId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { movieDetail, movieShows, loading } = useSelector(store => store.movieState);

    useEffect(() => {
        if (movieId) {
            dispatch(getMovieDetail(movieId));
            dispatch(getMovieShows(movieId));
        }
    }, [movieId, dispatch]);

    const formatDuration = (minutes) => {
        if (!minutes) return '';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const groupShowsByTheater = (shows) => {
        const grouped = {};
        shows.forEach(show => {
            const theaterId = show.theater._id;
            if (!grouped[theaterId]) {
                grouped[theaterId] = {
                    theater: show.theater,
                    shows: []
                };
            }
            grouped[theaterId].shows.push(show);
        });
        return Object.values(grouped);
    };

    const handleBookShow = (showId) => {
        navigate(`/show/${showId}`);
    };

    if (loading) {
        return (
            <div className="movie-detail-loading">
                <div className="loading-spinner">Loading movie details...</div>
            </div>
        );
    }

    if (!movieDetail) {
        return (
            <div className="movie-detail-error">
                <h2>Movie not found</h2>
                <Button onClick={() => navigate('/')}>Back to Home</Button>
            </div>
        );
    }

    const theaterGroups = groupShowsByTheater(movieShows);

    return (
        <div className="movie-detail-page">
            {/* Hero Section */}
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
                                        <Button size="large" type="default">
                                            Add to Watchlist
                                        </Button>
                                    </Space>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Content Section */}
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
                            {/* Show Timings */}
                            <Card className="show-timings" title="Show Timings" style={{ marginBottom: '24px' }}>
                                {theaterGroups.length > 0 ? (
                                    <div className="theater-shows">
                                        {theaterGroups.map(theaterGroup => (
                                            <div key={theaterGroup.theater._id} className="theater-group">
                                                <div className="theater-name">
                                                    <Text strong>{theaterGroup.theater.name}</Text>
                                                    {theaterGroup.theater.location && (
                                                        <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                                                            {theaterGroup.theater.location}
                                                        </Text>
                                                    )}
                                                </div>
                                                <Divider style={{ margin: '8px 0' }} />
                                                <div className="show-times">
                                                    <Space wrap>
                                                        {theaterGroup.shows.map(show => (
                                                            <Button
                                                                key={show._id}
                                                                type="default"
                                                                size="small"
                                                                onClick={() => handleBookShow(show._id)}
                                                                style={{ margin: '2px' }}
                                                            >
                                                                {new Date(show.showTime).toLocaleTimeString('en-US', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                                <br />
                                                                <Text type="secondary" style={{ fontSize: '10px' }}>
                                                                    {show.screen.screenType}
                                                                </Text>
                                                            </Button>
                                                        ))}
                                                    </Space>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <Text type="secondary">No shows available for this movie.</Text>
                                )}
                            </Card>

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
        </div>
    );
};

export default Movie;