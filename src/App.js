import React, { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import './style/App.less';
import './style/loading.less';

const App = () => {
  return (
    <div className='container'>
      <h1 className='title'>weather forecasting web application</h1>
      <div className='search-block'>
        <Form
          name="basic"
          autoComplete="off"
        >
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: 'Please input location!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}


export default App;