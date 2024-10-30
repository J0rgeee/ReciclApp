import React, { useState } from 'react';
import { Card, Button, Form, Image } from 'react-bootstrap';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => setLikes(likes + 1);
  const handleComment = () => {
    if (newComment) {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  return (
    <Card className="mb-3">
      <Card.Header>
        <strong>{post.emailUsuario}</strong> - {post.timeCreate}
      </Card.Header>
      <Card.Body>
        <Image src={post.img} fluid />
        <Card.Text>{post.desc}</Card.Text>
        <div>
          <Button variant="outline-primary" onClick={handleLike}>
            Me gusta {likes}
          </Button>
          <Button variant="outline-secondary" className="ms-2">Compartir</Button>
        </div>
        <Form.Control
          type="text"
          placeholder="Añadir un comentario"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mt-2"
        />
        <Button onClick={handleComment} className="mt-1">Comentar</Button>
        {comments.length > 0 && (
          <div className="mt-2">
            {comments.map((comment, index) => (
              <p key={index} className="m-0">{comment}</p>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default Post;
