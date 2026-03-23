import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd';

const MovieLink = ({ id, title, poster }) => <Link to={`movie/${id}`}>
    <img src={poster} alt={title} style={{ width: '100%', borderRadius: '8px 8px 0 0' }} />
</Link>

const MovieCard = ({ movie }) => {
    const { id, name: title, poster, thumbnail, genres } = movie;

    return (
        <Card
            hoverable
            cover={<MovieLink id={id} poster={thumbnail} title={title} />}
            style={{ width: '240px' }}
        >
            <Card.Meta title={title} description={genres} />
        </Card>
    );
}

export default MovieCard;
