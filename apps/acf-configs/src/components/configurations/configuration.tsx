import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import { ConfigType, getConfig } from '../../database';
import { downloadFile } from '../../storage';

const Configuration: React.FC = (props) => {
  const { id } = useParams();
  const [config, setConfig] = React.useState<ConfigType>();
  const [file, setFile] = React.useState<any>();
  console.log(id);

  useEffect(() => {
    // Fetch the configuration
    if (id) {
      getConfig(id).then(async (_config) => {
        setConfig(_config);
        const configuration = await downloadFile(`users/${_config?.userId}/${id}.json`);
        setFile(configuration);
      });
    }
  }, [id]);

  return (
    <main className='container-fluid m-auto'>
      <div className='d-flex justify-content-center align-items-center p-5 m-5'>
        {config ? (
          <Card>
            <Card.Body>
              <Card.Title>{config.name}</Card.Title>
              <Card.Text>{config.url}</Card.Text>
            </Card.Body>
            <JsonView src={file} enableClipboard />
          </Card>
        ) : (
          <div>Configuration not found</div>
        )}
      </div>
    </main>
  );
};

export default Configuration;
