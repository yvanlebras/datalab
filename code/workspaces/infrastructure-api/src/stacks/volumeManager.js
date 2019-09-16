import volumeApi from '../kubernetes/volumeApi';
import volumeGenerator from '../kubernetes/volumeGenerator';
import secretManager from '../credentials/secretManager';
import k8sSecretApi from '../kubernetes/secretApi';
import serviceApi from '../kubernetes/serviceApi';
import deploymentApi from '../kubernetes/deploymentApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import ingressGenerator from '../kubernetes/ingressGenerator';
import ingressApi from '../kubernetes/ingressApi';
import dataStorageRepository from '../dataaccess/dataStorageRepository';
import { createPersistentVolume, createDeployment, createService, createIngressRuleWithConnect } from './stackBuilders';
import { DELETED } from '../models/dataStorage.model';

const type = 'minio';

async function createVolume(user, params) {
  await dataStorageRepository.createOrUpdate(user, params);
  await createVolumeStack(params);
}

async function deleteVolume(params) {
  // Tag datastore as deleted but record will remain in db.
  await dataStorageRepository.update(params.name, { status: DELETED });
  await deleteVolumeStack(params);
}

async function createVolumeStack(params) {
  const { projectKey, name, volumeSize } = params;
  const secretStrategy = secretManager.createNewMinioCredentials;
  const rewriteTarget = '/';

  return secretManager.storeMinioCredentialsInVault(projectKey, name, secretStrategy)
    .then(secret => k8sSecretApi.createOrUpdateSecret(`${type}-${name}`, secret))
    .then(createPersistentVolume(name, volumeSize, volumeGenerator.createVolume))
    .then(createDeployment({ ...params, type }, deploymentGenerator.createMinioDeployment))
    .then(createService(name, type, deploymentGenerator.createMinioService))
    .then(createIngressRuleWithConnect({ ...params, type, rewriteTarget }, ingressGenerator.createIngress));
}

function deleteVolumeStack(params) {
  // Deletion of PVC is blocked to prevent breaking pods.
  const { datalabInfo, projectKey, name } = params;
  const k8sName = `${type}-${name}`;

  return ingressApi.deleteIngress(k8sName, datalabInfo)
    .then(() => serviceApi.deleteService(k8sName))
    .then(() => deploymentApi.deleteDeployment(k8sName))
    // .then(() => volumeApi.deletePersistentVolumeClaim(`${name}-claim`))
    .then(() => k8sSecretApi.deleteSecret(k8sName))
    .then(() => secretManager.deleteMinioCredentials(projectKey, name));
}

function queryVolume(params) {
  const { name } = params;

  return volumeApi.queryPersistentVolumeClaim(`${name}-claim`);
}

function listVolumes() {
  return volumeApi.listPersistentVolumeClaims();
}

export default { createVolume, deleteVolume, queryVolume, listVolumes };
