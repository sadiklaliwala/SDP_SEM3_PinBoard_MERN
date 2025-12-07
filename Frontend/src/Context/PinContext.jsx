import axios from 'axios';
import { createContext, useEffect, useMemo, useState ,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from "../Context/UserContext";

export const PinContext = createContext();

const PinContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState([]);
  const [currentPin, setCurrentPin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser, loading: userLoading } = useContext(UserContext); // add this and also import useContext and UserContext.jsx
  const navigate = useNavigate();

  const api = useMemo(() => {
    const backendUrl = "http://localhost:5000";
    return axios.create({
      baseURL: backendUrl,
      withCredentials: true,
    });
  }, []);

  const fetchAllPins = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/pins');
      if (response.data.success) setPins(response.data.pins);
    } catch (error) {
      console.log('Error fetching pins:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSinglePin = async (pinId, returnData = false) => {
    try {
      const response = await api.get(`/api/pins/${pinId}`);
      if (response.data.success) {
        if (returnData) return response.data.pin;
        setCurrentPin(response.data.pin);
      }
    } catch (error) {
      console.log('Error fetching single pin:', error.response);
    }
  };

  const createPin = async (formData, setImage, setImagePreview, setTitle, setDescription) => {
    setLoading(true);
    try {
      const response = await api.post('/api/pins/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        setPins(prev => [...prev, response.data.savedPin]);
        setImage(null);
        setImagePreview(null);
        setTitle('');
        setDescription('');
        toast.success('Pin created successfully');
        await fetchAllPins();
        navigate('/');
      }
    } catch (error) {
      console.log('Error creating pin:', error);
      toast.error(error.response?.data?.message || 'Error creating pin');
    } finally {
      setLoading(false);
    }
  };

  const updatePin = async (pinId, formData) => {
    setLoading(true);
    try {
      const response = await api.put(`/api/pins/${pinId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        toast.success('Pin updated successfully');
        await fetchSinglePin(pinId);
        navigate(`/pin/${pinId}`);
      }
    } catch (error) {
      console.error('Error updating pin:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error updating pin');
    } finally {
      setLoading(false);
    }
  };

  const deletePin = async (pinId) => {
    try {
      const response = await api.delete(`/api/pins/${pinId}`);
      if (response.data.success) {
        toast.success('Pin deleted successfully');
        await fetchAllPins();
        navigate('/');
      }
    } catch (error) {
      console.log('Error deleting pin:', error.response?.data);
      toast.error(error.response?.data?.message || 'Error deleting pin');
    }
  };

  const togglePinLike = async (pinId) => {
    try {
      const response = await api.put(`/api/pins/${pinId}/toggleLike`);
      if (response.data.success) {
        if (currentPin && currentPin._id === pinId) {
          setCurrentPin(prev => ({
            ...prev,
            likes: response.data.pin.likes,
            likedBy: response.data.liked,
          }));
        }
        setPins(prev => prev.map(pin => 
          pin._id === pinId 
            ? { ...pin, likes: response.data.pin.likes, likedBy: response.data.liked }
            : pin
        ));
      }
    } catch (error) {
      console.error('Error liking pin:', error);
    }
  };

  // ✅ New: Multi-reaction support
  const reactToPin = async (pinId, reactionType) => {
    try {
      const response = await api.put(`/api/pins/${pinId}/react`, { reaction: reactionType });
      if (response.data.success) {
        if (currentPin && currentPin._id === pinId) {
          setCurrentPin(prev => ({
            ...prev,
            reactions: response.data.pin.reactions,
            reactionCounts: response.data.pin.reactionCounts,
          }));
        }
        setPins(prev => prev.map(pin =>
          pin._id === pinId
            ? {
                ...pin,
                reactions: response.data.pin.reactions,
                reactionCounts: response.data.pin.reactionCounts,
              }
            : pin
        ));
      }
    } catch (error) {
      console.error('Error reacting to pin:', error);
    }
  };

  const createComment = async (comment, setComment, pinId) => {
    try {
      const { data } = await api.post(`/api/pins/${pinId}/comments/create`, { comment });
      toast.success(data.message);
      setComment('');
      await fetchSinglePin(pinId);
    } catch (error) {
      console.log('Error creating comment:', error.response);
      toast.error(error.response?.data?.message);
    }
  };

  const deleteComment = async (pinId, commentId) => {
    try {
      const { data } = await api.delete(`/api/pins/${pinId}/comments/${commentId}`);
      await fetchSinglePin(currentPin._id);
      toast.success(data.message);
    } catch (error) {
      console.log('Error deleting comment:', error.response);
    }
  };

  // useEffect(() => { fetchAllPins(); }, []);
  useEffect(() => {
    if (!userLoading && currentUser) {
      fetchAllPins();
    }
  }, [userLoading, currentUser]);


  const values = {
    pins,
    setPins,
    currentPin,
    setCurrentPin,
    fetchAllPins,
    fetchSinglePin,
    createPin,
    updatePin,
    deletePin,
    loading,
    setLoading,
    createComment,
    deleteComment,
    togglePinLike,
    reactToPin, // ✅ added
    searchTerm,
    setSearchTerm,
  };

  return <PinContext.Provider value={values}>{children}</PinContext.Provider>;
};

export default PinContextProvider;