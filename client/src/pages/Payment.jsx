import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Row, Col, Typography, List, Divider, message, Spin } from 'antd';
import { CreditCardOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { confirmBooking } from '../redux/bookingSlice';
import getApiClient from '../util/api_client';

const { Title, Text } = Typography;

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userData } = useSelector(state => state.userState);
    const { invoiceDetails, bookingDetail } = useSelector(state => state.bookingState);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    // Get booking details from navigation state
    const { showId, selectedSeats, showDetails } = location.state || {};

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (!invoiceDetails || invoiceDetails.totalAmount === 0) {
            // message.error('Invalid payment details');
            navigate(-1);
        }
    }, [invoiceDetails]);

    const handleProceedPayment = async () => {
        try {
            const apiClient = getApiClient();
            const { order, razorpayKey } = invoiceDetails;
            // Razorpay options
            const options = {
                key: razorpayKey,
                amount: order.amount,
                currency: order.currency,
                name: 'Book My Ticket',
                description: 'Movie Ticket Booking',
                order_id: order.id,

                handler: async function (response) {
                    try {
                        dispatch(confirmBooking({
                            invoiceId: invoiceDetails._id,
                            paymentDetails: {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            }
                        }));
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        message.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: userData?.name || '',
                    email: userData?.email || '',
                    contact: userData?.phone || '',
                },
                theme: {
                    color: '#1890ff',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Payment error:', error);
            message.error('Failed to initiate payment');
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
                    {
                        bookingDetail && (
                            <Card title="Booking Confirmed!" bordered={false} style={{ marginBottom: '24px', backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <CreditCardOutlined style={{ fontSize: '24px', color: '#52c41a', marginRight: '12px' }} />
                                    <div>
                                        <Title level={4} style={{ marginBottom: 0 }}>Your booking is confirmed!</Title>
                                        <Text type="success">Enjoy your movie experience.</Text>
                                    </div>
                                </div>
                            </Card>
                        )
                    }
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
                                ₹{invoiceDetails?.totalAmount}
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