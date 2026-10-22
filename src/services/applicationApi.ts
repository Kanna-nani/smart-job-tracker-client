import axios from "axios";
import type { ApplicationInput } from "../types/application";

const API_URL = "http://localhost:5000/api/applications";

export const getApplications = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};

export const createApplication = async (application: ApplicationInput)=>{
  const responce = await axios.post(API_URL, application);
  return responce.data;
}

export const updateApplication  = async(
  id:string,
  application : ApplicationInput
) =>{
  const response = await axios.put(
    `${API_URL}/${id}`,
    application
  );
  return response.data;
}
export const deleteApplication = async(id:string)=>{
  const responce = await axios.delete(`${API_URL}/${id}`);
  return responce.data;
}