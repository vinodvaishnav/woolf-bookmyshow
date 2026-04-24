import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Space, Modal, Form, Input, InputNumber, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getMovies } from '../redux/movieSlice';
import apiClient from '../util/api_client';

const MovieListing = () => {
    const dispatch = useDispatch();
    const { movies, loading } = useSelector(state => state.movieState);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        dispatch(getMovies());
    }, [dispatch]);

    const handleAddMovie = () => {
        setIsEditMode(false);
        setEditingMovie(null);
        formRef.current?.resetFields();
        setIsModalVisible(true);
    };

    const handleEditMovie = (movie) => {
        setIsEditMode(true);
        setEditingMovie(movie);
        formRef.current?.setFieldsValue({
            name: movie.name,
            imdbRating: movie.imdbRating,
            description: movie.description,
            poster: movie.poster,
            thumbnail: movie.thumbnail,
            duration: movie.duration,
            genres: movie.genres,
        });
        setIsModalVisible(true);
    };

    const handleDeleteMovie = async (movieId) => {
        try {
            await apiClient.delete(`movies/${movieId}`);
            message.success('Movie deleted successfully');
            dispatch(getMovies());
        } catch (error) {
            console.error('Error deleting movie:', error);
            message.error('Failed to delete movie');
        }
    };

    const handleModalOk = async () => {
        try {
            setSubmitting(true);

            if (!formRef.current) {
                message.error('Form is not initialized');
                return;
            }

            const values = await formRef.current.validateFields();

            if (isEditMode && editingMovie) {
                // Update movie
                await apiClient.put(`movies/${editingMovie._id}`, values);
                message.success('Movie updated successfully');
            } else {
                // Add new movie
                await apiClient.post('movies', values);
                message.success('Movie added successfully');
            }

            setIsModalVisible(false);
            formRef.current.resetFields();
            dispatch(getMovies());
        } catch (error) {
            console.error('Error saving movie:', error);
            if (error.response) {
                message.error(error.response.data?.message || 'Failed to save movie');
            } else {
                message.error('Failed to save movie');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        formRef.current?.resetFields();
        setEditingMovie(null);
    };

    const columns = [
        {
            title: 'Movie Name',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
            render: (text) => text || '-',
        },
        // {
        //     title: 'IMDb Rating',
        //     dataIndex: 'imdbRating',
        //     key: 'imdbRating',
        //     width: 120,
        //     sorter: (a, b) => (a.imdbRating || 0) - (b.imdbRating || 0),
        //     render: (rating) => (
        //         <span>{rating ? rating.toFixed(2) : 'N/A'}</span>
        //     ),
        // },
        {
            title: 'Release Date',
            dataIndex: 'releaseDate',
            key: 'releaseDate',
            width: 150,
            sorter: (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate),
            render: (date) => date ? new Date(date).toLocaleDateString() : '-',
        },
        {
            title: 'Genres',
            dataIndex: 'genres',
            key: 'genres',
            width: 150,
            render: (genres) => genres || '-',
        },
        {
            title: 'Poster',
            dataIndex: 'poster',
            key: 'poster',
            width: 100,
            render: (poster) => (
                poster ? (
                    <img
                        src={poster}
                        alt="poster"
                        style={{ width: '50px', height: 'auto', borderRadius: '4px' }}
                    />
                ) : (
                    <span>No Image</span>
                )
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            filters: [
                { text: 'Active', value: 'active' },
                { text: 'Inactive', value: 'inactive' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => (
                <span style={{
                    color: status === 'active' ? '#52c41a' : '#f5222d',
                    fontWeight: 500,
                }}>
                    {status ? status.charAt(0).toUpperCase() + status.slice(1) : '-'}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEditMovie(record)}
                        size="small"
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Movie"
                        description="Are you sure you want to delete this movie?"
                        onConfirm={() => handleDeleteMovie(record._id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddMovie}
                    size="large"
                >
                    Add Movie
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={movies}
                rowKey="_id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} movies`,
                }}
                scroll={{ x: 1000 }}
            />

            <Modal
                title={isEditMode ? 'Edit Movie' : 'Add New Movie'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                confirmLoading={submitting}
                width={600}
            >
                <Form
                    ref={formRef}
                    layout="vertical"
                    requiredMark="optional"
                >
                    <Form.Item
                        name="name"
                        label="Movie Name"
                        rules={[
                            { required: true, message: 'Please enter movie name' },
                            { min: 2, message: 'Movie name must be at least 2 characters' },
                        ]}
                    >
                        <Input placeholder="Enter movie name" />
                    </Form.Item>

                    <Form.Item
                        name="imdbRating"
                        label="IMDb Rating"
                        rules={[
                            {
                                type: 'number',
                                min: 0,
                                max: 10,
                                message: 'Rating must be between 0 and 10',
                            },
                        ]}
                    >
                        <InputNumber
                            min={0}
                            max={10}
                            step={0.1}
                            placeholder="Enter rating (0-10)"
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Enter movie description"
                        />
                    </Form.Item>

                    <Form.Item
                        name="genres"
                        label="Genres"
                    >
                        <Input placeholder="e.g., Action, Drama, Comedy" />
                    </Form.Item>

                    <Form.Item
                        name="duration"
                        label="Duration (in minutes)"
                        rules={[
                            {
                                type: 'number',
                                min: 1,
                                message: 'Duration must be at least 1 minute',
                            },
                        ]}
                    >
                        <InputNumber
                            min={1}
                            placeholder="Enter duration in minutes"
                        />
                    </Form.Item>

                    <Form.Item
                        name="poster"
                        label="Poster URL"
                        rules={[
                            {
                                type: 'url',
                                message: 'Please enter a valid URL',
                            },
                        ]}
                    >
                        <Input placeholder="https://example.com/poster.jpg" />
                    </Form.Item>

                    <Form.Item
                        name="thumbnail"
                        label="Thumbnail URL"
                        rules={[
                            {
                                type: 'url',
                                message: 'Please enter a valid URL',
                            },
                        ]}
                    >
                        <Input placeholder="https://example.com/thumbnail.jpg" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MovieListing;