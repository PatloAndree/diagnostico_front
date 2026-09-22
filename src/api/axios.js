import axios from 'axios';

export default axios.create({
  //COLOCAR TU DIREECIÓN IP : PUERTO / CARPETA
  // baseURL: 'http://10.0.2.2:8000/api/',
  baseURL: 'http://192.168.18.30:8000/api/',
  timeout: 9000,
  headers: { 'Content-Type': 'application/json' },
});
