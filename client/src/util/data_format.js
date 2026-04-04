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