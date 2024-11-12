import React, { useState, useEffect } from 'react';
import { Button, Form, Image, Card } from 'react-bootstrap';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import './publi.styles.css'

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const getCsrfToken = () => {
  const cookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
  return cookie ? cookie.split('=')[1] : null;
};

const Post = ({ post }) => {
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [hasLiked, setHasLiked] = useState(post.has_liked);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  //Para iconos de google fonts 
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);
  
  // Cargar comentarios al montar el componente
  useEffect(() => {
    axios.get(`http://localhost:8000/api/publicaciones/${post.idPublicacion}/comments/`)
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.error("Error al cargar comentarios:", error.response?.data || error.message);
      });
  }, [post.idPublicacion]);

  // Manejar el like
  const handleLike = () => {
    axios.post(`http://localhost:8000/api/publicaciones/${post.idPublicacion}/like/`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken(),  // Incluir el token CSRF si es necesario
      },
      withCredentials: true,  // Permitir envío de cookies de sesión
    })
    .then(response => {
      setLikesCount(response.data.likes_count);
      setHasLiked(response.data.has_liked);
    })
    .catch(error => {
      console.error("Error al procesar like/unlike:", error.response?.data || error.message);
    });
  };

  // Manejar el envío del comentario
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    axios.post(`http://localhost:8000/api/publicaciones/${post.idPublicacion}/comments/`, {
        content: newComment  // Aquí es donde colocas el comentario en el cuerpo de la solicitud
      }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),  // Incluir el token CSRF si es necesario
        },
        withCredentials: true,  // Permitir envío de cookies de sesión
      }
    )
    .then(response => {
      setComments([...comments, response.data]); // Agregar el nuevo comentario al final
      setNewComment(''); // Limpiar el campo de comentario
    })
    .catch(error => {
      console.error("Error al enviar comentario:", error.response?.data || error.message);
    });
  };

  return (
    <div className="post">
      <Card className="m-2" >
      <Card.Header>
        <Image src="holder.js/171x180" rounded className="mx-auto"/>
        <strong>{post.username}</strong> - <span className='span'>{formatDistanceToNow(new Date(post.timeCreate), { addSuffix: true, locale: es })}</span>
      </Card.Header>
      <Card.Body>
        <Card.Text>{post.desc}</Card.Text>
        <div className='text-center'>
          <Image src={post.img} fluid className='img-publi'/>
        </div>
        
        
        <div className="like-comment">
          <Button className='button-like' variant='light'>
            <span class="material-symbols-outlined" onClick={handleLike}>favorite</span>
          {hasLiked ? "" : ""} 
          </Button>
          <span className='d-flex likescount m-1'>{likesCount}</span>
        </div>
        <div className="comments-section">
        <h5 className='m-2'>Comentarios</h5>
        {comments.map((comment, index) => (
          <p key={index}>{comment.content}</p>
        ))}

        <Form onSubmit={handleCommentSubmit} className='form'>
          <Form.Control
            type="text"
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="m-2"
          />
          <Button type="submit" className='button-like' variant='light'>
            <span class="material-symbols-outlined">send</span>
          </Button>
        </Form>
      </div>        
      </Card.Body>
    </Card>
   
    </div>
  );
};

export default Post;