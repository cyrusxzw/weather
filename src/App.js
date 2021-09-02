import React, { useState } from 'react';
import { Form, Input, Button, Modal, Row, Col, Card } from 'antd';
import './style/App.less';
import './style/loading.less';

const App = () => {

  const [form] = Form.useForm();
  const [weather, setWeather] = useState([]);
  const [location, setLocation] = useState("");
  const loadingHtml = document.getElementById('ajaxLoading');

  const onFinish = values => {
    const query = values.location;
    fetchApi(query);
  }

  const onReset = () => {
    form.resetFields();
  };

  const fetchApi = async location => {
    loadingHtml.style.display = "block";
    const API_KEY = 'pk.ae605bdb985108cff0e63b76ae6560a8';
    const url = `https://eu1.locationiq.com/v1/search.php?key=${API_KEY}&q=${location}&format=json`;
    try {
      const response = await fetch(url).then(data => checkStatus(data));
      //pick the first one from response data
      if (response[0]) {
        const lat = response[0].lat;
        const lon = response[0].lon;
        const location = response[0].display_name;
        setLocation(location);
        return fetchWeather({
          lat,
          lon
        })
      }
    } catch (error) {
      handleError();
    }
  }

  const fetchWeather = async ({ lat, lon }) => {
    const API_KEY = 'd0f74ee2b252941d10e4a89d81fb639e';
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric& exclude=current,minutely,hourly&appid=${API_KEY}`;
    try {
      const response = await fetch(url).then(data => checkStatus(data));
      loadingHtml.style.display = "none";
      setWeather(response.daily);
    } catch (error) {
      handleError();
    }
  }

  //check response status, if not 200, display error message
  const checkStatus = (data) => {
    if (data.status !== 200) {
      console.log(`There is a problem. Status Code: ${data.status}`);
      return;
    } else {
      return data.json();
    }
  }

  //handle result from fetch with error
  const handleError = () => {
    loadingHtml.style.display = "none";
    onReset();
    Modal.error({
      title: 'Request failed! Please enter a valid location!',
    });
  }

  const generateWeather = () => {
    if (weather && weather.length) {
      const weatherHtml = weather.map((element, index) => {
        if (index > 0) {
          const date = new Date(element.dt * 1000).toLocaleDateString('en-GB');
          const day = new Date(element.dt * 1000).toLocaleDateString('en-GB', {
            weekday: "long",
          });
          const maxTemp = element.temp.max.toFixed(0);
          const minTemp = element.temp.min.toFixed(0);
          const weatherCondition = element.weather[0].main;
          const icon = element.weather[0].icon;
          return (
            <Col key={index} xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }}>
              <Card title={day} className='weatherCard'>
                <p>{date}</p>
                <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="" />
                <p className='weatherCondition'>{weatherCondition}</p>
                <div className="temp"><span>{maxTemp}°</span><span>{minTemp}°</span></div>
              </Card>
            </Col>
          )
        } else {
          return ""
        }
      });
      return weatherHtml;
    }
    else {
      return "";
    }
  }

  return (
    <div className='container'>
      <h1 className='title'>weather forecasting web application</h1>
      <div className='search-block'>
        <h3 className='searchedLocation'>
          {/* display location from locationiq.com */}
          {
            location ? `Searched Location: ${location}` : ""
          }
        </h3>
        <Form
          form={form}
          name="searchForm"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item
            name='location'
            className='inputContainer'
            rules={[{ required: true, message: 'Location cannot be empty!' }]}
          >
            <Input placeholder='Please Input City Name or Suburb or Buiding Name' />
          </Form.Item>

          <Form.Item className='submitContainer'>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <div className='weather-block'>
          <Row gutter={10}>
            {generateWeather()}
          </Row>
        </div>
      </div>
    </div>
  )
}


export default App;