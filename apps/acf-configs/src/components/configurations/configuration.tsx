import { Configuration as ConfigurationType } from '@dhruv-techapps/acf-common';
import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import { ConfigType, getConfig } from '../../database';
import { downloadFile } from '../../storage';
import { onDownloadClick } from '../../util/common';

export const Configuration: React.FC<{ configId?: string }> = ({ configId }) => {
  let { id } = useParams();
  const [config, setConfig] = React.useState<ConfigType>();
  const [file, setFile] = React.useState<ConfigurationType>();
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

  if (!id) {
    return <h1>Configuration not found</h1>;
  }

  return (
    <div>
      <main className='container-fluid m-auto'>
        <div className='d-flex justify-content-center'>
          {loading ? (
            <h1>Loading Configuration...</h1>
          ) : config ? (
            <div>
              <h1>{config.name}</h1>
              <p>{config.url}</p>
              <hr />
              {file && (
                <>
                  <div className='d-flex justify-content-end'>
                    <Button className='ms-2' onClick={() => onDownloadClick(file, id)}>
                      Download
                    </Button>
                  </div>
                  <JsonView src={file} enableClipboard={false} />
                </>
              )}
            </div>
          ) : (
            <h1>Configuration not found</h1>
          )}
        </div>
      </main>
    </div>
  );
};
