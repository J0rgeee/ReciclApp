import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const NewPostForm = ({ onAddPost }) => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message && image) {
      onAddPost({
        user: 'Usuario123',
        timeAgo: 'Hace un momento',
        message,
        image,
        likes: 0
      });
      setMessage('');
      setImage(null);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Control
        type="text"
        placeholder="Escribe algo..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Form.Control
        type="file"
        className="mt-2"
        onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
      />
      <Button type="submit" className="mt-2">Publicar</Button>
    </Form>
  );
};

export default NewPostForm;
