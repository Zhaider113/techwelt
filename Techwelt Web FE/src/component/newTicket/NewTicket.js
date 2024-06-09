import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { postTicket } from "../../services/axios";
import "react-phone-number-input/style.css";
import "./NewTicket.css";
import axios from 'axios';

const DATA = [
  {
    subject: "mypic.jpeg",
  },
  {
    subject: "Testfile.pdf",
  },
  {
    subject: "myvideo.mp4",
  },
  {
    subject: "1234435345.png",
  },
  {
    subject: "Test.mp4",
  },
];

const NewTicket = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [image, setImagePath] = useState('');

  const [formData, setFormData] = useState({
    subject: "",
    text: "",
    image: ""
  });

  const handlData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
        let formDataFile = new FormData();
        formDataFile.append('avatar', selectedFile);
        var result = await axios.post('/api/common/uploadAvatar', formDataFile, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        });
        setImagePath(result.data.filePath);
    }
}
  const handlSubmit = async () => {
    if (formData.text.length === 0) {
      alert("Enter Text");
    } else if (formData.subject.length === 0) {
      alert("Enter Subject");
    }else{
      var res = await postTicket(formData);
      if (res?.status == 200) {
        alert("New Ticket added successfully!")
        navigate("/Ticket");
      }else{
        console.log(res)
        alert(res.data.message)
      }
    }

  };

  return (
    <div className="new-ticket-main w-100">
      <p>New Ticket</p>
      <div className="new-ticket-div1 d-flex justify-content-center flex-column p-5 mx-auto bg-white">
        <div className="d-flex flex-column">
          <div className="sub1-subsub1-sub1-new-ticket-div1 d-flex flex-column">
            <label>Subject</label>
            <input
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handlData}
              required
            />
          </div>
          <div className="sub2-subsub1-sub1-new-ticket-div1 d-flex flex-column mt-4">
            <label>Text</label>
            <textarea
              className="w-100"
              name="text"
              type="text"
              value={formData.text}
              onChange={handlData}
              required
            />
          </div>
        </div>
        <div className={`d-flex w-100 my-5 ${isMobile && 'flex-column gap-5'}`}>
          <div className="right-subsub2-sub1-new-ticket-div1 d-flex col-md-6 justify-content-center">
            <span>Each file should Not be more than 20MB</span>
            <div className="sub1-right-subsub2-sub1-new-ticket-div1 position-relative">
              <img className="ml-4" crossOrigin='*' src={image ? process.env.REACT_APP_URL + '/' + image : './assets/file.svg'} alt="none" />
              <input className="position-absolute" type="file"  onChange={onChange}/>
            </div>
          </div>
        </div>
        <div className="tab-button d-flex justify-content-evenly align-items-center mx-auto mt-5" onClick={() => handlSubmit()}>
          <img src="./assets/whiteSend.svg" alt="none" />
          <button>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default NewTicket;
