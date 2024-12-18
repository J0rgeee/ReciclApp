import { useState, useEffect } from 'react';
import axios from 'axios';

const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/Publi/publi/', {
          withCredentials: true, 
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.cookie.split('csrftoken=')[1]?.split(';')[0]
          }
        });
        setPosts(response.data);
      } catch (error) {
        setError(error);
        console.error("Error al obtener publicaciones:", error);
      }
    };

    fetchPosts();
  }, []);

  return { posts, error };
};

export default usePosts;
