import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Calendar, Badge } from 'antd';
import axios from 'axios';
import moment from 'moment';

const UserCalendar = () => {
  const [form] = Form.useForm();
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/availability')
      .then(response => {
        setAvailabilities(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching availabilities!', error);
        message.error('Error fetching availabilities');
      });
  }, []);

  const onFinish = (values) => {
    const data = {
      user_name: values.name,
      user_email: values.email,
      user_linkedin: values.linkedin,
      slots: selectedSlots.map(slot => ({
        date: slot.date,
        start_time: slot.start_time,
        end_time: slot.end_time
      })),
    };

    axios.post('http://localhost:4000/bookings', data)
      .then(response => {
        message.success('Booking successful!');
        setSelectedSlots([]);
        form.resetFields(); // Clear the form after submission
      })
      .catch(error => {
        console.error('There was an error making the booking!', error);
        message.error('Error making booking');
      });
  };

  const addSlot = (slot) => {
    if (!selectedSlots.some(s => s.id === slot.id)) {
      setSelectedSlots([...selectedSlots, slot]);
    } else {
      message.info('This slot is already selected');
    }
  };

  const removeSlot = (slot) => {
    setSelectedSlots(selectedSlots.filter(s => s.id !== slot.id));
  };

  const cellRender = (value) => {
    const dateString = value.format('YYYY-MM-DD');
    const listData = availabilities.filter(item => item.date === dateString);

    return (
      <ul className="events">
        {listData.map(item => (
          <li key={item.id.toString()} onClick={() => addSlot(item)} style={{ cursor: 'pointer', color: 'green' }}>
            <Badge status="success" text={`${item.start_time} - ${item.end_time}`} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>Available Slots</h1>
      <Calendar dateCellRender={cellRender} />
      <div>
        <h2>Selected Slots</h2>
        <ul>
          {selectedSlots.map(slot => (
            <li key={slot.id.toString()}>
              {slot.date} {slot.start_time} - {slot.end_time}
              <Button onClick={() => removeSlot(slot)}>Remove</Button>
            </li>
          ))}
        </ul>
      </div>
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item name="linkedin" rules={[{ required: true, message: 'Please input your LinkedIn URL!' }]}>
          <Input placeholder="LinkedIn URL" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Book
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserCalendar;
