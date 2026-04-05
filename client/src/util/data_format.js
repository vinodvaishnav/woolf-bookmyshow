export const formatDuration = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const groupShowsByTheater = (shows) => {
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

export const groupShowsByDateAndTheater = (shows) => {
    const grouped = {};
    shows.forEach(show => {
        const date = new Date(show.showTime).toDateString(); // Group by date string
        const theaterId = show.theater._id;
        if (!grouped[date]) {
            grouped[date] = {};
        }
        if (!grouped[date][theaterId]) {
            grouped[date][theaterId] = {
                theater: show.theater,
                shows: []
            };
        }
        grouped[date][theaterId].shows.push(show);
    });
    // Convert to array of dates with theaters
    return Object.keys(grouped).map(date => ({
        date,
        theaters: Object.values(grouped[date])
    })).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
};

export const groupSeatsByRow = (seats) => {
    const grouped = {};
    seats.forEach(seat => {
        const row = seat.row;
        if (!grouped[row]) {
            grouped[row] = [];
        }
        grouped[row].push(seat);
    });
    // Sort rows alphabetically and seats within each row by number
    const sortedRows = Object.keys(grouped).sort();
    return sortedRows.map(row => ({
        row,
        seats: grouped[row].sort((a, b) => a.number - b.number)
    }));
};