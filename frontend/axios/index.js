// ✨ implement axiosWithAuth
import axios from "axios";

 
const baseURL = 'http://localhost:9000/api/articles'

export const getData = () => {
   axios.get(baseURL)
    .then(res => console.log(res))
    .catch(err => console.log(err.response))
  };