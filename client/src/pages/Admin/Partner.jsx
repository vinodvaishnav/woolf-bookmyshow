import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Space, Modal, Form, Input, Select, InputNumber, message, Popconfirm, Switch, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { getTheaters, getRegions, addTheater, updateTheater, deleteTheater, toggleTheaterStatus } from '../../redux/theaterSlice';
import getApiClient from '../../util/api_client';

const { Option } = Select;

const PartnerManager = () => {
    const dispatch = useDispatch();
    const { theaters, regions, loading } = useSelector(state => state.theaterState);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingTheater, setEditingTheater] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        dispatch(getTheaters());
        dispatch(getRegions());
    }, [dispatch]);

    const handleAddTheater = () => {
        setIsEditMode(false);
        setEditingTheater(null);
        formRef.current?.resetFields();
        setIsModalVisible(true);
    };

    const handleEditTheater = (theater) => {
        setIsEditMode(true);
        setEditingTheater(theater);
        formRef.current?.setFieldsValue({
            name: theater.name,
            region: theater.region?._id || theater.region,
            address: theater.address,
            latitude: theater.mapCordinates?.latitude,
            longitude: theater.mapCordinates?.longitude,
            contactPerson: theater.contactPerson,
            contactEmail: theater.contactEmail,
            contactPhone: theater.contactPhone,
        });
        setIsModalVisible(true);
    };

    const handleDeleteTheater = async (theaterId) => {
        try {
            await getApiClient().delete(`theaters/${theaterId}`);
            message.success('Theater deleted successfully');
            dispatch(getTheaters());
        } catch (error) {
            console.error('Error deleting theater:', error);
            message.error('Failed to delete theater');
        }
    };

    const handleToggleStatus = async (theaterId, checked) => {
        try {
            await getApiClient().patch(`theaters/${theaterId}/toggle-status`);
            message.success(`Theater ${checked ? 'activated' : 'deactivated'} successfully`);
            dispatch(getTheaters());
        } catch (error) {
            console.error('Error toggling theater status:', error);
            message.error('Failed to update theater status');
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

            // Prepare theater data
            const theaterData = {
                name: values.name,
                region: values.region,
                address: values.address,
                mapCordinates: {
                    latitude: values.latitude,
                    longitude: values.longitude,
                },
                contactPerson: values.contactPerson,
                contactEmail: values.contactEmail,
                contactPhone: values.contactPhone,
            };

            if (isEditMode && editingTheater) {
                // Update theater
                await getApiClient().put(`theaters/${editingTheater._id}`, theaterData);
                message.success('Theater updated successfully');
            } else {
                // Add new theater
                await getApiClient().post('theaters', theaterData);
                message.success('Theater added successfully');
            }

            setIsModalVisible(false);
            formRef.current.resetFields();
            dispatch(getTheaters());
        } catch (error) {
            console.error('Error saving theater:', error);
            if (error.response) {
                message.error(error.response.data?.message || 'Failed to save theater');
            } else {
                message.error('Failed to save theater');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        formRef.current?.resetFields();
        setEditingTheater(null);
    };

    const columns = [
        {
            title: 'Theater Name',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
            render: (text) => text || '-',
        },
        {
            title: 'Region',
            dataIndex: 'region',
            key: 'region',
            width: 150,
            render: (region) => region?.name || '-',
            filters: regions.map(region => ({ text: region.name, value: region._id })),
            onFilter: (value, record) => record.region?._id === value,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: 200,
            render: (address) => address || '-',
        },
        {
            title: 'Contact Person',
            dataIndex: 'contactPerson',
            key: 'contactPerson',
            width: 150,
            render: (contactPerson) => contactPerson || '-',
        },
        {
            title: 'Contact Info',
            key: 'contactInfo',
            width: 200,
            render: (_, record) => (
                <div>
                    {record.contactEmail && (
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            <UserOutlined /> {record.contactEmail}
                        </div>
                    )}
                    {record.contactPhone && (
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            📞 {record.contactPhone}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            filters: [
                { text: 'Active', value: 'active' },
                { text: 'Inactive', value: 'inactive' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status, record) => (
                <Space>
                    <Tag color={status === 'active' ? 'green' : 'red'}>
                        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
                    </Tag>
                    <Switch
                        checked={status === 'active'}
                        onChange={(checked) => handleToggleStatus(record._id, checked)}
                        size="small"
                    />
                </Space>
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
                        onClick={() => handleEditTheater(record)}
                        size="small"
                    >
                        Edit
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Theaters</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddTheater}
                    size="large"
                >
                    Add Theater
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={theaters}
                rowKey="_id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} theaters`,
                }}
                scroll={{ x: 1200 }}
            />

            <Modal
                title={isEditMode ? 'Edit Theater' : 'Add New Theater'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                confirmLoading={submitting}
                width={700}
            >
                <Form
                    ref={formRef}
                    layout="vertical"
                    requiredMark="optional"
                >
                    <Form.Item
                        name="name"
                        label="Theater Name"
                        rules={[
                            { required: true, message: 'Please enter theater name' },
                            { min: 2, message: 'Theater name must be at least 2 characters' },
                        ]}
                    >
                        <Input placeholder="Enter theater name" />
                    </Form.Item>

                    <Form.Item
                        name="region"
                        label="Region"
                        rules={[
                            { required: true, message: 'Please select a region' },
                        ]}
                    >
                        <Select placeholder="Select region">
                            {regions.map(region => (
                                <Option key={region._id} value={region._id}>
                                    {region.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[
                            { required: true, message: 'Please enter theater address' },
                        ]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Enter complete theater address"
                        />
                    </Form.Item>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item
                            name="latitude"
                            label="Latitude"
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="Enter latitude"
                                step={0.000001}
                            />
                        </Form.Item>

                        <Form.Item
                            name="longitude"
                            label="Longitude"
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="Enter longitude"
                                step={0.000001}
                            />
                        </Form.Item>
                    </div>

                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px', marginTop: '16px' }}>
                        <h3 style={{ marginBottom: '16px', color: '#1890ff' }}>
                            <UserOutlined style={{ marginRight: '8px' }} />
                            Theater Owner / Contact Person
                        </h3>

                        <Form.Item
                            name="contactPerson"
                            label="Contact Person Name"
                            rules={[
                                { required: true, message: 'Please enter contact person name' },
                            ]}
                        >
                            <Input placeholder="Enter contact person name" />
                        </Form.Item>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <Form.Item
                                name="contactEmail"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Please enter email' },
                                    { type: 'email', message: 'Please enter a valid email' },
                                ]}
                            >
                                <Input placeholder="contact@example.com" />
                            </Form.Item>

                            <Form.Item
                                name="contactPhone"
                                label="Phone Number"
                                rules={[
                                    { required: true, message: 'Please enter phone number' },
                                    { pattern: /^\+?[\d\s\-\(\)]+$/, message: 'Please enter a valid phone number' },
                                ]}
                            >
                                <Input placeholder="+1 234 567 8900" />
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default PartnerManager;