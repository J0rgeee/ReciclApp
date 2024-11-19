import React, { useState, useEffect } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Button, Tab } from "react-bootstrap";
import usePosts from "../../hooks/usePosts";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const AdminPubli = () => {
  const { posts, setPosts, fetchPosts, error } = usePosts(); // Usar el hook
  const [pendientes, setPendientes] = useState([]);

  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/publicaciones/pendientes/', {
          withCredentials: true,
        });
        setPendientes(response.data);
      } catch (error) {
        console.error('Error al obtener publicaciones pendientes:', error);
      }
    };

    fetchPendientes();
  }, []);

  const aprobarPost = async (postId) => {
    try {
      await axios.patch(`http://localhost:8000/api/pendientes/${postId}/aprobar/`, {}, {
        withCredentials: true,
      });
      alert('Publicación aprobada con éxito');
      setPendientes(pendientes.filter((post) => post.idPublicacion !== postId)); // Actualizar la lista // Actualizar la lista de publicaciones
    } catch (error) {
      console.error('Error al aprobar la publicación:', error);
    }
  };

  const desaprobarPost = async (postId) => {
    try {
      await axios.patch(`http://localhost:8000/api/publicaciones/pendientes/${postId}/desaprobar/`, {}, {
        withCredentials: true,
      });
      alert('Publicación desaprobada con éxito');
      setPendientes(pendientes.filter((post) => post.idPublicacion !== postId)); // Actualizar la lista
    } catch (error) {
      console.error('Error al desaprobar la publicación:', error);
    }
  };

  const eliminarPost = async (postId) => {
    try {
      await axios.delete(`http://localhost:8000/api/publicaciones/pendientes/${postId}/eliminar/`, {
        withCredentials: true,
      });
      alert('Publicación eliminada con éxito');
      setPendientes(pendientes.filter((post) => post.idPublicacion !== postId)); // Actualizar la lista
    } catch (error) {
      console.error('Error al eliminar la publicación:', error);
    }
  };

  return (
    <div>
        
    <Table bordered hover>
      <thead>
        <tr>
          <th>Id</th>
          <th>Descripcion</th>
          <th>Fecha publicación</th>
          <th>Ruta</th>
          <th>Email</th>
          <th>Usuario</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) =>(
          <tr key={post.idPublicacion}>
              <td>{post.idPublicacion}</td>
              <td>{post.desc}</td>
              <td>{post.timeCreate}</td>
              <td>{post.img}</td>
              <td>{post.emailUsuario}</td>
              <td>{post.username}</td>
              <td><Button onClick={() => desaprobarPost(post.idPublicacion)}>Desaprobar</Button></td>
              <td><Button variant="danger">Eliminar</Button></td>
          </tr>
          ))} 
      </tbody>
    </Table>
    <h1>Publicaciones Pendientes</h1>
    <Table bordered hover>
      <thead>
        <tr>
          <th>Id</th>
          <th>Descripcion</th>
          <th>Fecha publicación</th>
          <th>Ruta</th>
          <th>Email</th>
          <th>Usuario</th>
        </tr>
      </thead>
      <tbody>
        {pendientes.map((post) =>(
          <tr key={post.idPublicacion}>
              <td>{post.idPublicacion}</td>
              <td>{post.desc}</td>
              <td>{post.timeCreate}</td>
              <td>{post.img}</td>
              <td>{post.emailUsuario}</td>
              <td>{post.username}</td>
              <td><Button onClick={() => aprobarPost(post.idPublicacion)}>Aprobar</Button></td>
              <td><Button variant="danger" onClick={() => eliminarPost(post.idPublicacion)}>Eliminar</Button></td>
          </tr>
          ))} 
      </tbody>
    </Table>
    </div>
  );
};

export default AdminPubli;