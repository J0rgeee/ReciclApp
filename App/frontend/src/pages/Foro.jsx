import React from 'react';
import usePosts from '../hooks/usePosts'
import PostList from './componentes/Publicacion/listaPubli';
import AgregarPublicacion from './componentes/Publicacion/nuevaPubli';
import './foro.styles.css'

export function Foro() {
 
  const { posts, setPosts, error } = usePosts();
  
  return (
    <div className='divforo'>
      <AgregarPublicacion setPosts={setPosts}/>
      {error ? (
        <p>Error al cargar publicaciones: {error.message}</p>
      ) : (
      <PostList posts={posts} />
      )}
    </div>
  );
};