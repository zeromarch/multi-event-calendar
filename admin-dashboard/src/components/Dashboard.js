import React, { useState, useEffect } from 'react';
import { Form, DatePicker, TimePicker, Button, Table, message, Input } from 'antd';
import axios from 'axios';

const Dashboard = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [availabilities, setAvailabilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [iframeLink, setIframeLink] = useState('');

  const fetchAvailabilities = () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:4000/availability', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setAvailabilities(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching availabilities!', error);
        message.error('Error fetching availabilities');
      });
  };

  const fetchBookings = () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:4000/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setBookings(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching bookings!', error);
        message.error('Error fetching bookings');
      });
  };

  useEffect(() => {
    fetchAvailabilities();
    fetchBookings();
  }, []);

  const onFinish = (values) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const data = {
      date: values.date.format('YYYY-MM-DD'),
      start_time: values.start_time.format('HH:mm'),
      end_time: values.end_time.format('HH:mm')
    };
    axios.post('http://localhost:4000/availability', data, config)
      .then(response => {
        message.success('Availability added successfully');
        fetchAvailabilities();
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error adding availability!', error);
        message.error('Error adding availability');
        setLoading(false);
      });
  };

  const generateIframeLink = () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:4000/generate-iframe', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setIframeLink(response.data.iframeLink);
      })
      .catch(error => {
        console.error('There was an error generating the iframe link!', error);
        message.error('Error generating iframe link');
      });
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Start Time',
      dataIndex: 'start_time',
      key: 'start_time',
    },
    {
      title: 'End Time',
      dataIndex: 'end_time',
      key: 'end_time',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button onClick={() => deleteAvailability(record.id)}>Delete</Button>
      ),
    }
  ];

  const bookingColumns = [
    {
      title: 'User Name',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Email',
      dataIndex: 'user_email',
      key: 'user_email',
    },
    {
      title: 'LinkedIn',
      dataIndex: 'user_linkedin',
      key: 'user_linkedin',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Start Time',
      dataIndex: 'start_time',
      key: 'start_time',
    },
    {
      title: 'End Time',
      dataIndex: 'end_time',
      key: 'end_time',
    }
  ];

  const deleteAvailability = (id) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:4000/availability/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        message.success('Availability deleted successfully');
        fetchAvailabilities();
      })
      .catch(error => {
        console.error('There was an error deleting availability!', error);
        message.error('Error deleting availability');
      });
  };

  return (
    <>
      <h2>Add Availability</h2>
      <Form form={form} name="availability" onFinish={onFinish} layout="inline">
        <Form.Item name="date" rules={[{ required: true, message: 'Please select a date!' }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item name="start_time" rules={[{ required: true, message: 'Please select a start time!' }]}>
          <TimePicker format="HH:mm" />
        </Form.Item>
        <Form.Item name="end_time" rules={[{ required: true, message: 'Please select an end time!' }]}>
          <TimePicker format="HH:mm" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Availability
          </Button>
        </Form.Item>
      </Form>
      <Table dataSource={availabilities} columns={columns} rowKey="id" style={{ marginTop: 16 }} />
      <h2>Bookings</h2>
      <Table dataSource={bookings} columns={bookingColumns} rowKey="id" style={{ marginTop: 16 }} />
      <Button type="primary" onClick={generateIframeLink} style={{ marginTop: 16 }}>
        Generate User Calendar Embed Link
      </Button>
      {iframeLink && (
        <div style={{ marginTop: 16 }}>
          <h2>Embed Link</h2>
          <Input.TextArea value={iframeLink} readOnly rows={4} />
        </div>
      )}
    </>
  );
};

export default Dashboard;
