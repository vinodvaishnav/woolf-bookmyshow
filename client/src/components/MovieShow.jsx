import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getMovieShows } from "../redux/showSlice";
import { Typography, Card, Button, Row, Space, Divider, Tabs, Col } from 'antd';
import { groupShowsByDateAndTheater, formatDate } from "../util/data_format";
import Loading from "./Loading";

const { Title, Text } = Typography;

const MovieShow = ({ movieId }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { movieShows, loading } = useSelector(state => state.showState);

    useEffect(() => {
        if (movieId) {
            dispatch(getMovieShows(movieId));
        }
    }, [movieId, dispatch]);

    const handleBookShow = (showId) => {
        navigate(`/show/${showId}`);
    };

    const dateGroups = groupShowsByDateAndTheater(movieShows);

    return loading ?
        <Loading /> :
        (
            <div className="movie-content">
                <div className="container">
                    <Row gutter={[32, 32]}>
                        <Col span={24}>
                            <Title level={2}>Book Your Tickets</Title>
                            <div style={{ marginBottom: '24px', display: "block" }}>
                                {dateGroups.length > 0 ? (
                                    <Tabs defaultActiveKey={dateGroups[0]?.date} type="card">
                                        {dateGroups.map(dateGroup => (
                                            <Tabs.TabPane tab={formatDate(dateGroup.date)} key={dateGroup.date}>
                                                <Card className="show-timings" title={`Show Timings for ${formatDate(dateGroup.date)}`} style={{ marginBottom: '24px' }}>
                                                    <div className="theater-shows">
                                                        {dateGroup.theaters.map(theaterGroup => (
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
                                                </Card>
                                            </Tabs.TabPane>
                                        ))}
                                    </Tabs>
                                ) : (
                                    <Text type="secondary">No shows available for this movie.</Text>
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
};

export default MovieShow;