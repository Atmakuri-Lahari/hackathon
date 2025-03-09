import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Base API URL
const API_URL_AUTH = `${API_BASE_URL}/auth`;
const API_URL_EVENTSPACES = `${API_BASE_URL}/eventSpaces`;
const API_URL_BOOKINGS = `${API_BASE_URL}/bookings`;

// ✅ Get Auth Token
const getAuthToken = () => localStorage.getItem("token");

// ✅ Axios Instance with Auth Header
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

// ✅ Register User
export const registerUser = async (userData) => {
  return await axios.post(`${API_URL_AUTH}/register`, userData);
};

// ✅ Login User
export const loginUser = async (userData) => {
  return await axios.post(`${API_URL_AUTH}/login`, userData);
};

// ✅ Get All Event Spaces
export const getAllEventSpaces = async () => {
  return axios.get(`${API_URL_EVENTSPACES}`);
};

// ✅ Get Event Space by ID (With Date Query for Available Slots)
export const getEventSpaceById = async (id, date) => {
  return axios.get(`${API_URL_EVENTSPACES}/${id}`, {
    params: { date }, // ✅ Send date as a query parameter
  });
};
// Gets dynamic event space ID


export const bookEventSpace = async (eventSpaceId, bookingDate, selectedSlot, selectedMeal, numPeople, userId) => {
  try {
    const eventSpaceId = req.params.id; 
    const response = await axios.post(`http://localhost:5000/api/eventSpaces/${eventSpaceId}/book`, {
      bookingDate,
      selectedSlot,
      selectedMeal,
      numPeople,
      userId,
    });

    console.log("Booking API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Booking API Error:", error.response?.data || error.message);
    throw error.response?.data || { error: "Booking failed." };
  }
};


// ✅ Get User Bookings
export const getUserBookings = async (userId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL_BOOKINGS}/my-bookings/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user bookings:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Add Event Space (Multipart Form Data for Images)
export const addEventSpace = async (eventData) => {
  const token = getAuthToken();
  return axios.post(`${API_URL_EVENTSPACES}/add`, eventData, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
  });
};
