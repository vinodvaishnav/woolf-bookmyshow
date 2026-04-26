import { createSlice } from '@reduxjs/toolkit';
import getApiClient from '../util/api_client';

const bookingSlice = createSlice({
    name: 'bookingSlice',
    initialState: {
        showId: null,
        selectedSeats: [],
        invoiceDetails: null,
        loading: false,
        bookingDetail: null,
    },
    reducers: {
        // Define reducers if needed for booking state management
        setBookingDetails: (state, action) => {
            state.bookingDetail = action.payload;
        },

        setSelectedSeats: (state, action) => {
            state.selectedSeats = action.payload;
        },

        setShowId: (state, action) => {
            state.showId = action.payload;
        },

        setInvoiceDetails: (state, action) => {
            state.invoiceDetails = action.payload;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const createBooking = (bookingData) => async (dispatch) => {
    const { actions } = bookingSlice;
    console.log(bookingData);
    dispatch(actions.setLoading(true));

    getApiClient().post('bookings', bookingData)
        .then((response) => {
            dispatch(actions.setInvoiceDetails(response.data));
            dispatch(actions.setShowId(bookingData.showId));
            dispatch(actions.setSelectedSeats(bookingData.showSeatIds));
        })
        .catch(error => console.log(error))
        .finally(() => {
            dispatch(actions.setLoading(false));
        })
}

export const confirmBooking = (bookingData) => async (dispatch) => {
    // Implement confirm booking logic if needed
    const { actions } = bookingSlice;
    dispatch(actions.setLoading(true));

    getApiClient().post('bookings/confirm', bookingData)
        .then((response) => {
            dispatch(actions.setBookingDetails(response.data));
            // unset invoiceDetails and selectedSeats
            dispatch(actions.setInvoiceDetails(null));
            dispatch(actions.setSelectedSeats([]));
        })
        .catch(error => console.log(error))
        .finally(() => {
            dispatch(actions.setLoading(false));
        })

}

export default bookingSlice;