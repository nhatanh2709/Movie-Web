import React from 'react'
import { useRef, useEffect, useContext } from 'react';
import './faceLogin.scss';
import * as faceapi from "face-api.js";
import { AuthContext } from '../authContext/AuthContext';
import { loginAI } from '../authContext/apiCalls';
import axios from 'axios';
import Toastify from 'toastify-js';
import { useNavigate } from 'react-router-dom';

const FaceLogin = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const {dispatch} = useContext(AuthContext);
  const navigate = useNavigate();
  let faceDescriptors = [];
  let faceMatcher;
  const loadTranningData = async () => {
    Toastify({
      text: 'Load Model Thành Công',
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
        display : "flex",
        justifyContent: "center",  // Căn giữa theo chiều ngang
        alignItems: "center",
      },
    }).showToast();
    let info;
    try {
      info = await axios.get(`${process.env.REACT_APP_URL}/api/users/getAll`); 
    } catch (err) {
      console.log(err);
    }
    let cnt = 0;
    info.data.map(async (item) => {
      try {
        try {
          if (item.profilePic !== undefined) {
            const image = await faceapi.fetchImage(item.profilePic);
            const detections = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withFaceDescriptor();
            const descriptors = [
              new Float32Array(detections.descriptor)
            ]
            faceDescriptors.push(new faceapi.LabeledFaceDescriptors(item.email, descriptors));  
          }
        } catch(err) {
          console.log(item.profilePic);
        }
        cnt ++;
        if(cnt === info.data.length) {
          faceMatcher = new faceapi.FaceMatcher(faceDescriptors , 0.7);
          console.log(faceMatcher);
          Toastify({
            text: 'Load Dữ liệu Thành Công',
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
              display : "flex",
              justifyContent: "center",  // Căn giữa theo chiều ngang
              alignItems: "center",
            },
          }).showToast();
        }
      }
      catch (err) {
        console.log(err);
      }
    })

  }
  let email;
  const handleLogin = () => {
    try {
      console.log(email);
      loginAI({email}, dispatch);
      navigate('/');
      
    } catch(err) {
      console.log(err);
    }
    
  }
  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((currentStream) => {
        if (!videoRef.current || !canvasRef.current) return;
        videoRef.current.srcObject = currentStream;
        faceDetection();

      })

      .catch((err) => {
        console.error(err)
      });
  }

  const faceDetection = async () => {
    try {
      let intervalId;
      try {
        intervalId = setInterval(async () => {
          if (!videoRef.current || !videoRef.current.srcObject || !canvasRef.current) {
            clearInterval(intervalId);
            return ;
          }
          const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withFaceDescriptors();
          if (detections.length === 0) return;
          faceapi.matchDimensions(canvasRef.current, {
            width: window.innerWidth,
            height: window.innerHeight,
          })
    
          const resizedDetections = faceapi.resizeResults(detections, {
            width: window.innerWidth,
            height: window.innerHeight,
          });
          let finalLabel;
          if(faceMatcher !== undefined) {
            for (const detection of resizedDetections) {
              const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
              const label = `${bestMatch.label} (${Math.round(
                bestMatch.distance * 100
              )}%)`;
              const drawBox = new faceapi.draw.DrawBox(detection.detection.box, {
                label: label,
              });
              finalLabel = bestMatch.label;
            }
            email = finalLabel;
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            clearInterval(intervalId);
            if(finalLabel !== undefined) {
              handleLogin();
              Toastify({
                text: 'Đăng nhập thành công',
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                  display : "flex",
                  justifyContent: "center",  // Căn giữa theo chiều ngang
                  alignItems: "center",
                },
              }).showToast();
            }
            else {
              Toastify({
                text: 'Đăng nhập thất bại. Xin mời đăng kí',
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                  display : "flex",
                  justifyContent: "center",  // Căn giữa theo chiều ngang
                  alignItems: "center",
                },
              }).showToast();
              
              navigate('/register')
            }
            return ;
    
          }
          
        }, 2000)
      } catch(err) {
        clearInterval(intervalId);
      }
    } catch(err) {
      console.log(err);
    }
  }


  useEffect(() => {
    const loadModels = async () => {
      Toastify({
        text: 'Bắt đầu load Model',
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
          display : "flex",
          justifyContent: "center",  // Căn giữa theo chiều ngang
          alignItems: "center",
        },
      }).showToast();
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]).then(loadTranningData).then(startVideo).catch((e) => console.log(e))
    };
    videoRef.current && loadModels();
  }, [])


  return (
    <div className="app">
      <h1> AI FACE DETECTION</h1>
      <div className='app__video'>
        <video crossOrigin='anonymous' ref={videoRef} autoPlay ></video>
      </div>
      <canvas ref={canvasRef} width="940" height="650" className='app__canvas' />

    </div>
  );
}

export default FaceLogin
