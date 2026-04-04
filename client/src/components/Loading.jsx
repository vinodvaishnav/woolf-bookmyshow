const Loading = ({ message }) => {
    return (
        <div className="loading-spinner">
            {message ?? 'Loading...'}
        </div>
    );
};

export default Loading;