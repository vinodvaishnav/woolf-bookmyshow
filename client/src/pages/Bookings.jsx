import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Spin, Typography, Tag } from 'antd';
import { getBookings } from '../redux/bookingSlice';

const { Title } = Typography;

const Bookings = () => {
    const dispatch = useDispatch();
    const { bookings, loading } = useSelector(state => state.bookingState);

    useEffect(() => {
        dispatch(getBookings());
    }, [dispatch]);

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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {bookings.map(booking => (
                    <Card
                        key={booking._id}
                        style={{ width: 300 }}
                        title={booking.show?.movie?.name || 'Movie'}
                    >
                        <p><strong>Theater:</strong> {booking.show?.theater?.name || 'N/A'}</p>
                        <p><strong>Show Time:</strong> {new Date(booking.show?.showTime).toLocaleString()}</p>
                        <p><strong>Amount:</strong> ₹{booking.amount}</p>
                        <p><strong>Status:</strong> <Tag color={getStatusColor(booking.status)}>{booking.status.toUpperCase()}</Tag></p>
                        <p><strong>Booked At:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Bookings;