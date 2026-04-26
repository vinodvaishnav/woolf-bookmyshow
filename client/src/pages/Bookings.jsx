import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Spin, Typography, Tag, Modal, Button, Empty } from 'antd';
import { getBookings, fetchBookingDetails } from '../redux/bookingSlice';

const { Title, Text } = Typography;

const Bookings = () => {
    const dispatch = useDispatch();
    const { bookings, loading, bookingDetail } = useSelector(state => state.bookingState);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    useEffect(() => {
        dispatch(getBookings());
    }, [dispatch]);

    const handleCardClick = (bookingId) => {
        setSelectedBookingId(bookingId);
        dispatch(fetchBookingDetails(bookingId));
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedBookingId(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'green';
            case 'pending': return 'orange';
            case 'canceled': return 'red';
            case 'rejected': return 'red';
            default: return 'default';
        }
    };

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>My Bookings</Title>
            {bookings.length === 0 && !loading ? (
                <Empty description="No bookings found" />
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    {bookings.map(booking => (
                        <Card
                            key={booking._id}
                            style={{ width: 300, cursor: 'pointer' }}
                            title={booking.show?.movie?.name || 'Movie'}
                            hoverable
                            onClick={() => handleCardClick(booking._id)}
                        >
                            <p><strong>Theater:</strong> {booking.show?.theater?.name || 'N/A'}</p>
                            <p><strong>Show Time:</strong> {new Date(booking.show?.showTime).toLocaleString()}</p>
                            <p><strong>Amount:</strong> ₹{booking.amount}</p>
                            <p><strong>Status:</strong> <Tag color={getStatusColor(booking.status)}>{booking.status.toUpperCase()}</Tag></p>
                            <p><strong>Booked At:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
                        </Card>
                    ))}
                </div>
            )}

            <Modal
                title="Booking Details"
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={[<Button key="close" onClick={handleModalClose}>Close</Button>]}
                width={600}
            >
                {loading ? (
                    <Spin />
                ) : bookingDetail ? (
                    <div>
                        <div style={{ marginBottom: '16px' }}>
                            <Text strong>Movie: </Text>
                            <Text>{bookingDetail.show?.movie?.name}</Text>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Text strong>Theater: </Text>
                            <Text>{bookingDetail.show?.theater?.name}</Text>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Text strong>Show Time: </Text>
                            <Text>{new Date(bookingDetail.show?.showTime).toLocaleString()}</Text>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Text strong>Amount: </Text>
                            <Text>₹{bookingDetail.amount}</Text>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Text strong>Status: </Text>
                            <Tag color={getStatusColor(bookingDetail.status)}>{bookingDetail.status.toUpperCase()}</Tag>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Text strong>Booking ID: </Text>
                            <Text>{bookingDetail._id}</Text>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Text strong>Booked At: </Text>
                            <Text>{new Date(bookingDetail.createdAt).toLocaleString()}</Text>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Text strong>Number of Seats: </Text>
                            <Text>{bookingDetail.seats?.length || 0}</Text>
                        </div>
                        {bookingDetail.seats && bookingDetail.seats.length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                                <Text strong>Seats: </Text>
                                <div>
                                    {bookingDetail.seats.map((seat, index) => (
                                        <Tag key={index} style={{ marginRight: '8px', marginBottom: '8px' }}>
                                            {seat.seat?.row}{seat.seat?.number}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}
            </Modal>
        </div>
    );
};

export default Bookings;