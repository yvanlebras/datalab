import axios from 'axios';
import logger from '../config/logger';
import config from '../config/config';
import { handleCreateError, handleDeleteError } from './core';

const API_BASE = config.get('kubernetesApi');

const getDeploymentUrl = namespace => `${API_BASE}/apis/apps/v1beta1/namespaces/${namespace}/deployments`;

const YAML_CONTENT_HEADER = { headers: { 'Content-Type': 'application/yaml' } };

function createOrUpdateDeployment(name, namespace, manifest) {
  return getDeployment(name, namespace)
    .then(createOrReplace(name, namespace, manifest));
}

const createOrReplace = (name, namespace, manifest) => (existingDeployment) => {
  if (existingDeployment) {
    return updateDeployment(name, namespace, manifest);
  }

  return createDeployment(name, namespace, manifest);
};

function getDeployment(name, namespace) {
  return axios.get(`${getDeploymentUrl(namespace)}/${name}`)
    .then(response => response.data)
    .catch(() => undefined);
}

function createDeployment(name, namespace, manifest) {
  logger.info('Creating deployment: %s', name);
  return axios.post(getDeploymentUrl(namespace), manifest, YAML_CONTENT_HEADER)
    .catch(handleCreateError);
}

function updateDeployment(name, namespace, manifest) {
  logger.info('Updating deployment: %s', name);
  return axios.put(`${getDeploymentUrl(namespace)}/${name}`, manifest, YAML_CONTENT_HEADER)
    .catch(handleCreateError);
}

function deleteDeployment(name, namespace) {
  logger.info('Deleting deployment: %s', name);
  const deleteOptions = {
    kind: 'DeleteOptions',
    apiVersion: 'v1',
    propagationPolicy: 'Foreground',
  };

  return axios.delete(`${getDeploymentUrl(namespace)}/${name}`, { data: deleteOptions })
    .then(response => response.data)
    .catch(handleDeleteError('deployment', name));
}

export default { getDeployment, createDeployment, deleteDeployment, updateDeployment, createOrUpdateDeployment };
