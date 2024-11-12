import React from 'react';
import Post from './publicacion';

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