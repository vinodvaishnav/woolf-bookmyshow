import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getShowDetail, getShowSeats } from "../redux/showSlice";
import { groupSeatsByRow } from "../util/data_format";
import { createBooking } from "../redux/bookingSlice";

import Loading from "../components/Loading";
import {
    Typography,
    Card,
    Button,
    Row,
    Col,
    Divider,
    Space,
    Empty,
    Statistic,
    Modal,
    Tag
} from "antd";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Show = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showId } = useParams();
    const { showDetail, showSeats, loading } = useSelector(state => state.showState);
    const { userData } = useSelector(state => state.userState);
    const { invoiceDetails } = useSelector(state => state.bookingState);

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatsByRow, setSeatsByRow] = useState([]);

    useEffect(() => {
        if (showId) {
            dispatch(getShowDetail(showId));
            dispatch(getShowSeats(showId));
        }
    }, [showId, dispatch]);

    useEffect(() => {
        if (showDetail && showDetail.screen && showSeats) {
            setSeatsByRow(groupSeatsByRow(showSeats));
        }
    }, [showDetail, showSeats]);

    useEffect(() => {
        if (invoiceDetails) {
            navigate('/payment', {
                state: {
                    showId,
                    selectedSeats,
                    showDetails: showDetail
                }
            });
        }
    }, [invoiceDetails, navigate]);

    if (loading) {
        return <Loading />;
    }

    if (!showDetail) {
        return (
            <div className="show-detail-page" style={{ padding: '40px' }}>
                <Empty description="Show not found" />
            </div>
        );
    }

    const handleSeatClick = (seat) => {
        // Find the corresponding show seat status for this seat
        const seatId = seat._id;
        const isSeatSelected = selectedSeats.some(s => s._id === seatId);

        if (isSeatSelected) {
            setSelectedSeats(selectedSeats.filter(s => s._id !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const getSeatStatus = (seat) => {
        const seatStatus = showDetail.seatStatuses?.find(
            ss => ss.seat._id === seat._id
        );
        return seatStatus?.status || 'available';
    };

    const calculateTotalPrice = () => {
        return selectedSeats.reduce((total, showSeat) => {
            const seatTypePrice = showDetail.pricing?.find(
                p => p.seat_type._id === showSeat.seat.type
            );
            return total + (seatTypePrice?.price || 0);
        }, 0);
    };

    const handleProceedToPayment = () => {
        if (selectedSeats.length === 0) {
            Modal.warning({
                title: 'No Seats Selected',
                content: 'Please select at least one seat to proceed.',
            });
            return;
        }

        if (!userData._id) {
            Modal.warning({
                title: 'Login Required',
                content: 'Please login to complete your booking.',
                onOk: () => navigate('/login'),
            });

            return;
        }

        // block the seats for 15 minutes or until payment is completed
        dispatch(createBooking({
            showId,
            showSeatIds: selectedSeats.map(s => s._id)
        }));

        // Navigate to payment page with booking details
        // navigate('/payment', {
        //     state: {
        //         showId,
        //         selectedSeats,
        //         totalAmount: calculateTotalPrice(),
        //         showDetails: showDetail
        //     }
        // });
    };

    const getSeatButtonClass = (seat) => {
        const status = getSeatStatus(seat);
        const isSelected = selectedSeats.some(s => s._id === seat._id);

        let className = "seat-button";
        if (status === 'available' && isSelected) {
            className += " selected";
        } else if (status === 'booked') {
            className += " booked";
        } else if (status === 'blocked' || status === 'maintenance') {
            className += " blocked";
        }
        return className;
    };

    const totalPrice = calculateTotalPrice();

    return (
        <div className="show-detail-page">
            <div className="container" style={{ padding: '40px 20px' }}>
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={16}>
                        <Card className="seat-selection-card">
                            <Title level={2}>Select Your Seats</Title>

                            {/* Show Information */}
                            <Card size="small" style={{ marginBottom: '24px' }}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={12} sm={8}>
                                        <Statistic
                                            title="Movie"
                                            value={showDetail.movie?.name || 'N/A'}
                                            valueStyle={{ fontSize: '14px' }}
                                        />
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Statistic
                                            title="Theater"
                                            value={showDetail.theater?.name || 'N/A'}
                                            valueStyle={{ fontSize: '14px' }}
                                        />
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Statistic
                                            title="Show Time"
                                            value={new Date(showDetail.showTime).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                            valueStyle={{ fontSize: '14px' }}
                                        />
                                    </Col>
                                    <Col xs={24} sm={8}>
                                        <Statistic
                                            title="Screen"
                                            value={`${showDetail.screen?.name} - ${showDetail.screen?.screenType || 'N/A'}`}
                                            valueStyle={{ fontSize: '14px' }}
                                        />
                                    </Col>
                                </Row>
                            </Card>

                            {/* Screen Representation */}
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <div style={{
                                    background: 'linear-gradient(180deg, #e0e0e0 0%, #bdbdbd 100%)',
                                    padding: '16px',
                                    borderRadius: '8px 8px 0 0',
                                    marginBottom: '32px',
                                    fontWeight: 'bold',
                                    color: '#666'
                                }}>
                                    SCREEN
                                </div>
                            </div>

                            {/* Seats Grid */}
                            <div style={{ marginBottom: '24px' }}>
                                {seatsByRow.length > 0 ? (
                                    seatsByRow.map(rowData => (
                                        <div key={rowData.row} style={{ marginBottom: '16px' }}>
                                            <Row gutter={[8, 8]} align="middle">
                                                <Col xs={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                    {rowData.row}
                                                </Col>
                                                <Col xs={20}>
                                                    <Space wrap>
                                                        {rowData.seats.map(showSeat => {
                                                            const { status, seat } = showSeat;

                                                            const isSelected = selectedSeats.some(s => s._id === showSeat._id);

                                                            const seatTypePrice = showDetail.pricing?.find(
                                                                p => p.seat_type._id === seat.type
                                                            );

                                                            return (
                                                                <Tooltip key={showSeat._id} title={`${rowData.row}${seat.number} - ${seatTypePrice?.seat_type?.name} (₹${seatTypePrice?.price})`}>
                                                                    <Button
                                                                        className={getSeatButtonClass(seat)}
                                                                        onClick={() => handleSeatClick(showSeat)}
                                                                        disabled={status === 'booked' || status === 'blocked' || status === 'maintenance'}
                                                                        style={{
                                                                            width: '40px',
                                                                            height: '40px',
                                                                            padding: '0',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            fontSize: '12px',
                                                                            fontWeight: 'bold',
                                                                            ...(isSelected && status === 'available' && {
                                                                                background: '#1890ff',
                                                                                borderColor: '#1890ff',
                                                                                color: 'white'
                                                                            }),
                                                                            ...(status === 'booked' && {
                                                                                background: '#f5222d',
                                                                                borderColor: '#f5222d',
                                                                                color: 'white',
                                                                                cursor: 'not-allowed'
                                                                            }),
                                                                            ...(status === 'blocked' || status === 'maintenance') && {
                                                                                background: '#d9d9d9',
                                                                                borderColor: '#d9d9d9',
                                                                                color: '#999',
                                                                                cursor: 'not-allowed'
                                                                            }
                                                                        }}
                                                                    >
                                                                        {seat.number}
                                                                    </Button>
                                                                </Tooltip>
                                                            );
                                                        })}
                                                    </Space>
                                                </Col>
                                            </Row>
                                        </div>
                                    ))
                                ) : (
                                    <Empty description="No seats available" />
                                )}
                            </div>

                            {/* Legend */}
                            <Divider />
                            <Row gutter={[16, 16]} style={{ marginBottom: '24px', marginTop: '24px' }}>
                                <Col xs={12} sm={6}>
                                    <Space>
                                        <Button
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                background: '#fff',
                                                borderColor: '#d9d9d9',
                                                cursor: 'pointer'
                                            }}
                                            disabled
                                        >
                                            ◯
                                        </Button>
                                        <Text>Available</Text>
                                    </Space>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Space>
                                        <Button
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                background: '#1890ff',
                                                borderColor: '#1890ff',
                                                color: 'white',
                                                cursor: 'pointer'
                                            }}
                                            disabled
                                        >
                                            ✓
                                        </Button>
                                        <Text>Selected</Text>
                                    </Space>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Space>
                                        <Button
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                background: '#f5222d',
                                                borderColor: '#f5222d',
                                                color: 'white',
                                                cursor: 'not-allowed'
                                            }}
                                            disabled
                                        >
                                            ✗
                                        </Button>
                                        <Text>Booked</Text>
                                    </Space>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Space>
                                        <Button
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                background: '#d9d9d9',
                                                borderColor: '#d9d9d9',
                                                color: '#999',
                                                cursor: 'not-allowed'
                                            }}
                                            disabled
                                        >
                                            —
                                        </Button>
                                        <Text>Blocked</Text>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    {/* Booking Summary Sidebar */}
                    <Col xs={24} md={8}>
                        <Card className="booking-summary" style={{ position: 'sticky', top: '20px' }}>
                            <Title level={3}>Booking Summary</Title>
                            <Divider />

                            {/* Selected Seats List */}
                            {selectedSeats.length > 0 ? (
                                <>
                                    <div style={{ marginBottom: '16px' }}>
                                        <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                            Selected Seats:
                                        </Text>
                                        <div style={{ background: '#fafafa', padding: '12px', borderRadius: '4px' }}>
                                            <Space wrap>
                                                {selectedSeats.map(showSeat => (
                                                    <Tag key={showSeat._id} closable onClose={() => handleSeatClick(showSeat)}>
                                                        {showSeat.seat.row}{showSeat.seat.number}
                                                    </Tag>
                                                ))}
                                            </Space>
                                        </div>
                                    </div>
                                    <Divider />

                                    {/* Price Breakdown */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                            Price Breakdown:
                                        </Text>
                                        {selectedSeats.map(showSeat => {
                                            const seatTypePrice = showDetail.pricing?.find(
                                                p => p.seat_type._id === showSeat.seat.type
                                            );

                                            return (
                                                <div key={showSeat._id} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    padding: '4px 0',
                                                    fontSize: '12px'
                                                }}>
                                                    <span>{showSeat.seat.row}{showSeat.seat.number} ({seatTypePrice?.seat_type?.name})</span>
                                                    <span>₹{seatTypePrice?.price || 0}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <Empty description="No seats selected" style={{ marginBottom: '16px' }} />
                            )}

                            <Divider />

                            {/* Total Amount */}
                            <div style={{
                                background: '#e6f7ff',
                                padding: '16px',
                                borderRadius: '4px',
                                marginBottom: '16px',
                                textAlign: 'center'
                            }}>
                                <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                                    Total Amount
                                </Text>
                                <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                                    ₹{totalPrice}
                                </Title>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    ({selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''})
                                </Text>
                            </div>

                            {/* Action Buttons */}
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button
                                    type="primary"
                                    block
                                    size="large"
                                    onClick={handleProceedToPayment}
                                    disabled={selectedSeats.length === 0}
                                >
                                    Proceed to Payment
                                </Button>
                                <Button
                                    block
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

// Tooltip component (simple inline version)
const Tooltip = ({ title, children, ...props }) => {
    const [visible, setVisible] = React.useState(false);
    return (
        <div style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            {...props}
        >
            {children}
            {visible && (
                <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.75)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    fontSize: '12px',
                    zIndex: 1000,
                    marginBottom: '8px'
                }}>
                    {title}
                </div>
            )}
        </div>
    );
};

export default Show;