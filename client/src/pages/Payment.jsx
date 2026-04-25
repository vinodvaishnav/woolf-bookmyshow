import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Button, Row, Col, Typography, List, Divider, message, Spin } from 'antd';
import { CreditCardOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import getApiClient from '../util/api_client';

const { Title, Text } = Typography;

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn, data: user } = useSelector(state => state.userState);
    const [loading, setLoading] = useState(false);

    // Get booking details from navigation state
    const { showId, selectedSeats, totalAmount, showDetails } = location.state || {};

    useEffect(() => {
        // Redirect if no booking details or not logged in
        if (!isLoggedIn || !showId || !selectedSeats || selectedSeats.length === 0) {
            message.error('Invalid booking details. Please try again.');
            navigate('/');
            return;
        }
    }, [isLoggedIn, showId, selectedSeats, navigate]);

    const handleProceedPayment = async () => {
        setLoading(true);
        try {
            // Prepare the data for createBooking API
            const bookingData = {
                userId: user._id,
                showId: showId,
                showSeatIds: selectedSeats.map(seat => seat._id)
            };

            // Make the API call to create booking
            const response = await getApiClient().post('/bookings', bookingData);

            if (response.status === 201) {
                message.success('Booking created successfully! Proceeding to payment...');

                // Here you can navigate to actual payment gateway or confirmation page
                // For now, we'll navigate back to home or show a success message
                navigate('/', {
                    state: {
                        bookingCreated: true,
                        bookingDetails: response.data
                    }
                });
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create booking. Please try again.';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (!showDetails || !selectedSeats) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <Row gutter={[32, 32]}>
                <Col xs={24} lg={16}>
                    <Card title="Booking Summary" bordered={false}>
                        <div style={{ marginBottom: '24px' }}>
                            <Title level={4}>{showDetails.movie?.name}</Title>
                            <Text type="secondary">
                                {showDetails.theater?.name} - {showDetails.screen?.name}
                            </Text>
                            <br />
                            <Text type="secondary">
                                {new Date(showDetails.startTime).toLocaleString()}
                            </Text>
                        </div>

                        <Divider />

                        <div>
                            <Title level={5}>Selected Seats</Title>
                            <List
                                dataSource={selectedSeats}
                                renderItem={(seat) => (
                                    <List.Item>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                            <Text>Row {seat.seat.row} - Seat {seat.seat.number}</Text>
                                            <Text strong>
                                                ₹{showDetails.pricing?.find(p => p.seat_type._id === seat.seat.type)?.price || 0}
                                            </Text>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </div>

                        <Divider />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Title level={4}>Total Amount</Title>
                            <Title level={4} style={{ color: '#1890ff' }}>
                                ₹{totalAmount}
                            </Title>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Payment Details" bordered={false}>
                        <div style={{ marginBottom: '24px' }}>
                            <Text>Complete your payment to confirm the booking.</Text>
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            icon={<CreditCardOutlined />}
                            loading={loading}
                            onClick={handleProceedPayment}
                            block
                            style={{ marginBottom: '16px' }}
                        >
                            {loading ? 'Processing...' : 'Proceed to Payment'}
                        </Button>

                        <Button
                            type="default"
                            size="large"
                            icon={<ArrowLeftOutlined />}
                            onClick={handleGoBack}
                            block
                        >
                            Go Back
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Payment;