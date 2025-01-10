import { Configuration as ConfigurationType } from '@dhruv-techapps/acf-common';
import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useParams, useSearchParams } from 'react-router-dom';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import { ConfigType, getConfig } from '../../database';
import { downloadFile } from '../../storage';
import { download } from '../../util/common';

export const Configuration: React.FC<{ configId?: string }> = ({ configId }) => {
  let { id } = useParams();
  const [searchParams] = useSearchParams();
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

  const onDownloadClick = () => {
    if (file && id) {
      download(file, id, searchParams.get('queryID'));
    }
  };

  if (!id) {
    return <h1>Configuration not found</h1>;
  }

  return (
    <div>
      <main className='container-fluid m-auto'>
        <div className='d-flex justify-content-center m-5'>
          {loading && <h1>Loading Configuration...</h1>}
          {!loading && config && (
            <div>
              <h1>{config.name ?? 'Configuration'}</h1>
              {file && (
                <table className='table table-bordered'>
                  <tbody>
                    <tr>
                      <th scope='col'>URL:</th>
                      <td>{config.url}</td>
                    </tr>
                    <tr>
                      <th scope='col'>Load Type:</th>
                      <td>{file.loadType}</td>
                    </tr>
                    <tr>
                      <th scope='col'>Start Type:</th>
                      <td>{file.startType}</td>
                    </tr>
                    {file.startType === 'manual' && (
                      <tr>
                        <th scope='col'>Hot Key:</th>
                        <td>
                          {file.hotkey?.split('+').map((key, index) => (
                            <>
                              {index !== 0 && <b>+</b>}
                              <code key={key}>{key}</code>
                            </>
                          ))}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <th scope='col'>Initial Wait:</th>
                      <td>{file.initWait ?? 0} sec</td>
                    </tr>
                    <tr>
                      <th scope='col'>Actions:</th>
                      <td>{file.actions.length}</td>
                    </tr>
                    {file.batch && (
                      <tr>
                        <th scope='col'>Batch:</th>
                        <td>{file.batch?.refresh ? 'on refresh' : `${file.batch?.repeat} repeat with ${file.batch?.repeatInterval} sec interval`}</td>
                      </tr>
                    )}
                    {file.actions.filter((action) => action.value?.includes('GoogleSheets')).length > 0 && (
                      <tr>
                        <th scope='col'>Google Sheets:</th>
                        <td>Require value from google sheets</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
              {file && (
                <>
                  <div className='d-flex justify-content-start my-2'>
                    <Button variant='success' onClick={onDownloadClick}>
                      Download JSON
                    </Button>
                  </div>
                  <JsonView src={file} enableClipboard={false} style={{ minWidth: '1300px' }} />
                </>
              )}
            </div>
          )}
          {!loading && !config && <h1>Configuration not found</h1>}
        </div>
      </main>
    </div>
  );
};
