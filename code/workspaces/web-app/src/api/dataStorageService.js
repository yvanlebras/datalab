import { stackTypes } from 'common';
import { gqlMutation, gqlQuery } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

function loadDataStorage(projectKey) {
  const query = `
    DataStorage($projectKey: String!) {
      dataStorage(projectKey: $projectKey) {
         id, name, displayName, description, type, stacksMountingStore { id }, status, users
      }
    }`;

  return gqlQuery(query, { projectKey })
    .then((val) => {
      // map legacy stack.type of '1' to 'glusterfs'
      const newStacks = val.data.dataStorage.map(stack => ({
        ...stack,
        type: (stack.type === stackTypes.LEGACY_GLUSTERFS_VOLUME) ? stackTypes.GLUSTERFS_VOLUME : stack.type,
      }));
      const newVal = {
        data: {
          dataStorage: newStacks,
        },
      };
      return newVal;
    })
    .then(errorHandler('data.dataStorage', 'users'));
}

function getCredentials(projectKey, id) {
  const query = `
    GetCredentials($projectKey: String!, $id: ID!) {
      dataStore(projectKey: $projectKey, id: $id) {
        url, accessKey
      }
    }`;

  return gqlQuery(query, { projectKey, id })
    .then(errorHandler('data.dataStore'));
}

function createDataStore(projectKey, dataStore) {
  const mutation = `
    CreateDataStore($projectKey: String!, $dataStore:  DataStorageCreationRequest) {
      createDataStore(projectKey: $projectKey, dataStore: $dataStore) {
        name
      }
    }`;

  return gqlMutation(mutation, { projectKey, dataStore })
    .then(errorHandler('data.dataStorage'));
}

function deleteDataStore(projectKey, dataStore) {
  const mutation = `
    DeleteDataStore($projectKey: String!, $dataStore: DataStorageUpdateRequest) {
      deleteDataStore(projectKey: $projectKey, dataStore: $dataStore) {
        name
      }
    }`;

  return gqlMutation(mutation, { projectKey, dataStore })
    .then(errorHandler('data.dataStorage'));
}

function addUserToDataStore(projectKey, dataStore) {
  const mutation = `
    AddUserToDataStore($projectKey: String!, $dataStore:  DataStorageUpdateRequest) {
      addUserToDataStore(projectKey: $projectKey, dataStore: $dataStore) {
        name
      }
    }`;

  return gqlMutation(mutation, { projectKey, dataStore })
    .then(errorHandler('data.dataStorage'));
}

function removeUserFromDataStore(projectKey, dataStore) {
  const mutation = `
    RemoveUserFromDataStore($projectKey: String!, $dataStore:  DataStorageUpdateRequest) {
      removeUserFromDataStore(projectKey: $projectKey, dataStore: $dataStore) {
        name
      }
    }`;

  return gqlMutation(mutation, { projectKey, dataStore })
    .then(errorHandler('data.dataStorage'));
}

export default {
  loadDataStorage,
  getCredentials,
  createDataStore,
  deleteDataStore,
  addUserToDataStore,
  removeUserFromDataStore,
};
