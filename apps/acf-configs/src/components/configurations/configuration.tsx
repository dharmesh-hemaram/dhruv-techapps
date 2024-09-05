import React from 'react';
import { useParams } from 'react-router-dom';

const Configuration: React.FC = (props) => {
  const { configId, id } = useParams();
  console.log(configId, id);
  // Render the component
  return (
    <div>
      <h1>Configuration Component</h1>
    </div>
  );
};

export default Configuration;
