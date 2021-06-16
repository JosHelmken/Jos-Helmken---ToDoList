const API_URL = "http://127.0.0.1:3000/";

const APIRequest = method => {
  const headers = { 
    method: method,
    headers: { "Content-type": "application/json" }
  };
  return headers;
}

const APIUpdate = (method, data) => {
  const headers = {
    method: method,
    headers: { "Content-type": "application/json" },
    body: data
  };
  return headers;
}

// Get data from api //
const getData = async () => {
  try {
    const response = await fetch(API_URL, APIRequest('GET'));
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.log('Error: ', error);
  }
}

// Submit data to the api //
const postData = async body => {
  try {
    const response = await fetch(API_URL, APIUpdate('POST', body));
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.log('Error: ', error);
  }
}

// Delete data from the api //
const deleteData = async id => {
  try {
    await fetch(`${API_URL}${id}`, APIRequest('DELETE'));
  }
  catch (error) {
    console.log('Error: ', error);
  }
}

// Edit data from the api //
const updateData = async (id, body) => {
  try {
    const response = await fetch(`${API_URL}${id}`, APIUpdate('PUT', body));
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.log('Error: ', error);
  }
}