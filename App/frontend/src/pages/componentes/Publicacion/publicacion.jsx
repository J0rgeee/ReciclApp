import React, { useState, useEffect } from 'react';
import { Button, Form, Image, Card, Row, Col } from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
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
  const [currentUser, setCurrentUser] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (idComentario) => {
    setCommentToDelete(idComentario); // Guardar el ID del comentario a eliminar
    setShowModal(true);
  };

  //Para iconos de google fonts 
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);
  
  useEffect(() => {
    // Obtener usuario autenticado
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user', { withCredentials: true });
        setCurrentUser(response.data.user);  // Supón que response.data contiene el objeto de usuario
        console.log(response.data.user.email);
        console.log("Usuario autenticado:", currentUser.email);

      } catch (error) {
        console.error("Error al obtener el usuario autenticado:", error);
      }
    };
    fetchUser();
  }, []);

  // Cargar comentarios al montar el componente
  useEffect(() => {
    axios.get(`http://localhost:8000/api/publicaciones/${post.idPublicacion}/comments/`)
      .then(response => {
        setComments(response.data);
        console.log("Comentarios cargados:", response.data);
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
        contenido: newComment  // Aquí es donde colocas el comentario en el cuerpo de la solicitud
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
  
  const handleDeleteComment = () => {
    axios
      .delete(`http://localhost:8000/api/publicaciones/${post.idPublicacion}/comments/${commentToDelete}/`, {
        headers: {
          "X-CSRFToken": getCsrfToken(), // Incluye el token CSRF si es necesario
        },
        withCredentials: true,
      })
      .then((response) => {
        setComments(comments.filter(comment => comment.id !== commentToDelete)); // Actualiza los comentarios
        console.log("Comentario eliminado:", response.data);
        setShowModal(false); // Cierra el modal
      })
      .catch((error) => {
        console.error("Error al eliminar comentario:", error.response?.data || error.message);
      });
  };

  return (
    <div className="post">
      <Card className="m-2" >
      <Card.Header>
        <Image src="holder.js/171x180" rounded className="m-2"/>
        <strong>{post.username && post.username.charAt(0).toUpperCase() + post.username.slice(1)}</strong> - <span className='span'>{formatDistanceToNow(new Date(post.timeCreate), { addSuffix: true, locale: es })}</span>
      </Card.Header>
      <Card.Body>
        <Card.Text>{post.desc}</Card.Text>
        <div className='text-center'>
          <Image src={post.img} fluid className='img-publi'/>
        </div>
        
        
        <div className="like-comment">
          <Button className='button-like' variant='light'>
            <span className={`material-icons ${hasLiked ? 'liked' : ''}`} onClick={handleLike}>favorite</span>
          </Button>
          <span className='d-flex likescount m-1'>{likesCount}</span>
        </div>
        <div className="p-2">
        <h5 className=''>Comentarios</h5>
        {comments.map((comment) => (
          <Stack key={comment.id} className='comments-section' direction="horizontal" gap={3}>
            <div className='p-1 user'>{comment.usuario && comment.usuario.charAt(0).toUpperCase() + comment.usuario.slice(1)}</div>
            <div className='p-1 me-auto'>{comment.contenido}</div>
            <div className='p-1'>
              {currentUser.email === comment.usuario_email && (
                <Button  className='boton-delete' onClick={() => handleShowModal(comment.id) }>
                  <img src="/botones/btn-delete.svg"></img>
                </Button>
              )}
            </div>
          </Stack>
        ))}
        </div>
        {/* Modal para confirmar la eliminación */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body>¿Estás seguro de que deseas eliminar este comentario?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteComment}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>

        <Form onSubmit={handleCommentSubmit} className='form' fluid>
          <Form.Control
            type="text"
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="m-2"
          />
          <Button type="submit" className='button-like' variant='light'>
            <span class="material-icons">send</span>
          </Button>
        </Form> 
      </Card.Body>
      </Card>
   
    </div>
  );
};

export default Post;