import { Configuration } from '@dhruv-techapps/acf-common';
import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import { ConfigType, getConfig } from '../../database';
import { downloadFile } from '../../storage';

const Configuration: React.FC<{ configId: string }> = ({ configId }) => {
  let { id } = useParams();
  const [config, setConfig] = React.useState<ConfigType>();
  const [file, setFile] = React.useState<Configuration>();
  const [loading, setLoading] = React.useState(true);

  if (configId) {
    id = configId;
  }

  useEffect(() => {
    // Fetch the configuration
    if (id) {
      getConfig(id).then(async (_config) => {
        setConfig(_config);
        const configuration = await downloadFile(`users/${_config?.userId}/${id}.json`);
        setFile(configuration);
        setLoading(false);
      });
    }
  }, [id]);

  const onDownloadClick = () => {
    if (file) {
      const json = JSON.stringify(file);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${id}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <main className='container-fluid m-auto'>
        <div className='d-flex justify-content-center p-5 m-5'>
          {loading ? (
            <h1>Loading Configuration...</h1>
          ) : config ? (
            <div>
              <h1>{config.name}</h1>
              <p>{config.url}</p>
              <hr />
              <div className='d-flex justify-content-end'>
                <Button className='ms-2' onClick={onDownloadClick}>
                  Download
                </Button>
              </div>
              <JsonView src={file} enableClipboard={false} />
            </div>
          ) : (
            <h1>Configuration not found</h1>
          )}
        </div>
      </main>
    </div>
  );
};

export default Configuration;
