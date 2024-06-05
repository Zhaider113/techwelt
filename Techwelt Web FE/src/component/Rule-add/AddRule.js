import React, { useEffect, useState } from "react";
import { useMediaQuery, Autocomplete, TextField } from "@mui/material";
import { Teltonikas, Ruptelas } from "../../utils/mockup";
import { useNavigate } from "react-router-dom";
import { postRules } from "../../services/axios";

import "./AddRule.css";

const AddRule = () => {
  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width: 768px)");
  const [deviceType, setDeviceType] = useState('');
  const [ruleName, setRuleName] = useState('');
  const [deviceModels, setDeviceModels] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [checkedValues, setCheckedValues] = useState([]);
  const [formData, setFormData] = useState({
    ruleName: "",
    deviceBrand: "",
    deviceModel: "",
    ioPin:"",
    ioStatus: "",
    alertNotification: []
  });

  useEffect(() => {
    setFormData((prev) => {
      if (deviceType === 'Teltonika') {
        setDeviceModels(Teltonikas);
        return {
          ...prev,
          deviceBrand: deviceType,
          deviceModel: Teltonikas[0].device
        }
      } else if (deviceType === 'Ruptela') {
        setDeviceModels(Ruptelas);
        return {
          ...prev,
          deviceBrand: deviceType,
          deviceModel: Ruptelas[0].device
        }
      } else {
        setDeviceModels([].concat(Teltonikas).concat(Ruptelas));
        return {
          ...prev,
          deviceBrand: deviceType,
          deviceModel: Teltonikas[0].device
        }
      }
    });
  }, [deviceType])
  const handleData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
}
  const handleType = (e) => {
    setDeviceType(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
// to choose redio options
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setFormData({...formData, 'ioStatus': event.target.value});
  };
// to choose notification 
const handleNotification = (event) => {
  const { value, checked } = event.target;
  // Update the checkedValues array based on the checkbox state
  if (checked) {
    setCheckedValues([...checkedValues, value]); // Add value if checked
    setFormData({...formData, "alertNotification": checkedValues})
  } else {
    setCheckedValues(checkedValues.filter((item) => item !== value)); // Remove value if unchecked
    setFormData({...formData, "alertNotification": checkedValues})
  }
  console.log(event.target.value, event.target.checked, checkedValues)
};

  const handleModelSelect = (event, newValue) => {
    setFormData({ ...formData, 'deviceModel': newValue });
  }

  const handlePinSelect = (event) => {
    setFormData({ ...formData, 'ioPin': event.target.value });
  }

  const handleSubmit = async () => {
    // var res = await postRules(formData);
    // if (res?.status == 200) {
      alert("New Rule added successfully!")
      navigate("/Rules")
    // }else{
    //   console.log(res)
    //   alert(res.data.message)
    // }
  };

  return (
    <div className="add-rule-main w-100">
      <div className="sub1-div1">
        <p className="px-5 text-white d-flex justify-content-center align-items-center">
          Add Rule: <span className="ml-5">Engine ON</span>
        </p>
      </div>
      <div className="sub1-add-rule-div2 d-flex justify-content-between my-5 bg-white mx-auto px-4 py-5">
        <div className="subsub1-sub1-add-rule-div2 d-flex flex-column justify-content-between col-md-4">
          <input className="text-center" placeholder="Rule Name"  name='ruleName' value={formData.ruleName} onChange={handleData}/>
          <select className="text-center" value={formData.ioPin} onChange={(e) => {handlePinSelect(e);}}>
            <option disabled selected>
              I/O Pin
            </option>
            <option>pin 1</option>
            <option>pin 2</option>
          </select>
          <div className="sub1-subsub1-sub1-add-rule-div2 p-4 d-flex flex-column justify-content-center">
            <p>Alert Notifications:</p>
            <div className="subsub1-sub1-subsub1-sub1-add-rule-div2 d-flex flex-column">
              <div className="d-flex align-items-center my-2">
        <input
          type="checkbox"
          value="notification"
          checked={checkedValues.includes('notification')} // Check if value exists in array
          onChange={handleNotification}
        />
        <p className="ml-5 mb-0">Notification</p>
      </div>
      <div className="d-flex align-items-center my-2">
        <input
          type="checkbox"
          value="email"
          checked={checkedValues.includes('email')} // Check if value exists in array
          onChange={handleNotification}
        />
        <p className="ml-5 mb-0">Email</p>
      </div>
      <div className="d-flex align-items-center my-2">
        <input
          type="checkbox"
          value="sms"
          checked={checkedValues.includes('sms')} // Check if value exists in array
          onChange={handleNotification}
        />
        <p className="ml-5 mb-0">SMS</p>
      </div>
            </div>
          </div>
        </div>
        <div className="subsub2-sub1-add-rule-div2 d-flex flex-column justify-content-between col-md-4">
          {/* <select className="text-center">
            
            <option></option>
            <option></option>
          </select> */}
          <select className="normal-input" value={formData.deviceBrand} name="devicetype" type="text" onChange={(e) => {
            handleType(e);
          }}>
            <option disabled selected>Device Brand</option>
            <option>Teltonika</option>
            <option>Ruptela</option>
          </select>
          <select className="text-center">
            <option disabled selected>I/O Status</option>
          </select>
          <div className="sub1-subsub2-sub1-add-rule-div2 d-flex flex-column justify-content-center p-4">
            <div className="d-flex align-items-center my-2">
              <input
                type="radio"
                id="high"
                name="status" // Use a common name for the group
                value="HIGH"
                checked={selectedValue === 'HIGH'} // Set checked based on state
                onChange={handleChange}
              />
              <label htmlFor="high" className="ml-5 mb-0">
                HIGH
              </label>
            </div>
            <div className="d-flex align-items-center my-2">
              <input
                type="radio"
                id="low"
                name="status" // Use a common name for the group
                value="LOW"
                checked={selectedValue === 'LOW'} // Set checked based on state
                onChange={handleChange}
              />
              <label htmlFor="low" className="ml-5 mb-0">
                LOW
              </label>
            </div>
            <div className="w-100 d-flex align-items-center justify-content-between my-2">
              <div className="d-flex align-items-center">
                <input
                  type="radio"
                  id="greaterThan"
                  name="status" // Use a common name for the group
                  value="GREATER_THAN"
                  checked={selectedValue === 'GREATER_THAN'} // Set checked based on state
                  onChange={handleChange}
                />
                <label htmlFor="greaterThan" className="ml-5 mb-0">
                  Greater Than
                </label>
              </div>
              <input className="px-2" type="number" />
            </div>
            <div className="w-100 d-flex align-items-center justify-content-between my-2">
              <div className="d-flex align-items-center">
                <input
                  type="radio"
                  id="lessThan"
                  name="status" // Use a common name for the group
                  value="LESS_THAN"
                  checked={selectedValue === 'LESS_THAN'} // Set checked based on state
                  onChange={handleChange}
                />
                <label htmlFor="lessThan" className="ml-5 mb-0">
                  Less Than
                </label>
              </div>
              <input className="px-2" type="number" />
            </div>
          </div>
        </div>
        <div className="subsub3-sub1-add-rule-div2 col-md-4">
          <Autocomplete
            value={formData.deviceModel}
            onChange={handleModelSelect}
            options={deviceModels.map(item => item.device)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} style={{ fontSize: '1.6rem' }}>{option}</li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                style={{backgroundColor: 'white', height: '4rem', borderRadius: '.8rem', fontSize: '1.6rem', border: '.1rem solid #DFE0EB'}}
              />
            )}
          />
          {/* <select className="text-center w-100">
            <option disabled selected>Device Model</option>
            <option></option>
            <option></option>
          </select> */}
        </div>
        {isMobile && (
          <div className="tab-button d-flex justify-content-evenly align-items-center mx-auto">
            <img src="./assets/Save.svg" alt="none"/>
            <button  onClick={() => handleSubmit()}>Save</button>
          </div>
        )}
      </div>
      {!isMobile && (
        <div className="tab-button d-flex justify-content-evenly align-items-center mx-auto">
          <img src="./assets/Save.svg" alt="none"/>
          <button  onClick={() => handleSubmit()}>Save</button>
        </div>
      )}
    </div>
  );
};

export default AddRule;
