import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const Show = () => {
    const [seats, setSeats] = React.useState([]);
    const dispatch = useDispatch();
    const { showId } = useParams();

    useEffect(() => {
        if (showId) {
            // fetch Show Details along with seats status and pricing information
        }
    }, [showId, dispatch]);

    const handleBooking = () => {
        // showId, seats selected, user information (from auth state) will be used to book the tickets
        // send this information to backend and get the booking confirmation and details in response
        // redirect user to payment page with booking details and amount to be paid
    };

    return (
        <div className="show-detail-page">

        </div>
    );

}

export default Show;