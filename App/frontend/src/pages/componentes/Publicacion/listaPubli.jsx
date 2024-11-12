import React from 'react';
import Post from './publicacion';
import Table from 'react-bootstrap/Table';
import { Button } from "react-bootstrap";

const PostList = ({ posts }) => {
  return (
    <div className='lista-post'>
    {posts.map(post => (
        <Post post={post} />
      ))}
    </div>
  );
};

export default PostList;
