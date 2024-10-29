import axios from 'axios';
import React, { useState,useEffect } from 'react';
import PostList from './componentes/Publicacion/listaPubli';
import NewPostForm from './componentes/Publicacion/nuevaPubli';

export function Foro() {
 
  const [posts, setPosts] = useState([]);

  const usuActi = async() =>{
    const publi = await axios.get('http://localhost:8000/api/Publi/publi/');
   //console.log(useract);
    setPosts(publi.data);
    console.log(posts);
  }

  useEffect(() => {
    usuActi()
      .then(response => setPosts(response.data))
      .catch(error => console.error("Error al cargar publicaciones", error));
  },[]);

  const handleAddPost = (post) => {
    axios.post('http://localhost:8000/api/Publi/publi/', post)
      .then(response => setPosts([response.data, ...posts]))
      .catch(error => console.error("Error al añadir publicación", error));
  };

  return (
    <div>
      <NewPostForm onAddPost={handleAddPost} />
      <PostList posts={posts} />
    </div>
  );
};



/*
import React, { useState } from 'react';
import './foro.styles.css';

import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { FcLike } from "react-icons/fc";
import { FaComment } from "react-icons/fa";


export function Foro() {
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
  }

  return (
    <div className='container'>
      <Card>
      <Card.Header><Image src="holder.js/171x180" rounded /> {post.user} <span className="span">/ {post.timeAgo}</span></Card.Header>
        <Card.Body>
          <Card.Text>
          {post.message}
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
        </Card.Body>
        <Card.Img variant="bottom" src={post.image} className='img-foro'/>
        <Nav>
          <Nav.Item className='btn-foro' onClick={handleLike}>
            <FcLike className='button'/>{likes}
          </Nav.Item>
          <Nav.Item className='btn-foro'>
            <Form.Control
              type="text"
              placeholder="Añadir un comentario"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mt-2"
            />
            <Button onClick={handleComment}><FaComment /></Button>
            {comments.length > 0 && (
              <div className="mt-2">
                {comments.map((comment, index) => (
                  <p key={index} className="m-0">{comment}</p>
                ))}
              </div>
            )}
          </Nav.Item>
          <Nav.Item className='btn-foro'>
            <Button >
              Disabled
            </Button>
          </Nav.Item>
        </Nav>
      </Card>
    </div>
  )
}
*/
