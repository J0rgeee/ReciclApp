import axios from 'axios';
import React, { useState,useEffect } from 'react';
import PostList from './componentes/Publicacion/listaPubli';
import AgregarPublicacion from './componentes/Publicacion/nuevaPubli';
import './foro.styles.css'

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

  return (
    <div className='divforo'>
      <AgregarPublicacion />
      <PostList posts={posts} />
    </div>
  );
};