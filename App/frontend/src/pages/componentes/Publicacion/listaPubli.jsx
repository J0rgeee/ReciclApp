import React from 'react';
import Post from './publicacion';
import Table from 'react-bootstrap/Table';
import { Button } from "react-bootstrap";

const PostList = ({ posts }) => {
  return (
    <div style={{ marginLeft: '250px', flexGrow: 1 }}>
    {posts.map(post => (
        <Post post={post} />
      ))}
    </div>
  );
};

export default PostList;
