import { permissionTypes } from 'common';
import findIndex from 'lodash/findIndex';
import remove from 'lodash/remove';
import database from '../config/database';

const { INSTANCE_ADMIN_ROLE_KEY, CATALOGUE_ROLE_KEY, CATALOGUE_USER_ROLE } = permissionTypes;

// Default roles that don't need storing in Mongo
const defaultRoles = {
  [INSTANCE_ADMIN_ROLE_KEY]: false,
  [CATALOGUE_ROLE_KEY]: CATALOGUE_USER_ROLE,
};

function UserRoles() {
  return database.getModel('UserRoles');
}

function addDefaults(roles) {
  // The model document is first converted to an object so the spread operator works as expected.
  return {
    ...defaultRoles,
    ...roles.toObject(),
  };
}

async function getRoles(userId, userName) {
  let roles = await UserRoles().findOne({ userId }).exec();
  if (!roles) {
    roles = await addRecordForNewUser(userId, userName);
  }

  return addDefaults(roles);
}

function convertToUser(roles) {
  const userRoles = roles.toObject();
  const userName = userRoles.userName ? userRoles.userName : 'Unknown user name';
  const user = { userId: userRoles.userId, name: userName };
  return user;
}

async function getUser(userId) {
  const roles = await UserRoles().findOne({ userId }).exec();
  return convertToUser(roles);
}

async function getUsers() {
  const allRoles = await UserRoles().find().exec();
  const usersMap = allRoles
    .filter(roles => roles.userName) // only take users with known user names
    .map(roles => convertToUser(roles)) // convert to users
    .reduce((uniqueUsersMap, user) => { // convert to map, keyed by userId
      uniqueUsersMap[user.userId] = user; // eslint-disable-line no-param-reassign
      return uniqueUsersMap;
    }, {});
  return Object.values(usersMap); // return users
}

/*
Under some circumstances, duplicate records can be created for MongoDB users.
This function combines the roles for those users.
The underlying issue should be fixed - a technical debt story has been written.
If the roles are contradictory, the first one wins.
This is a reasonable approach, since when dealing with individual users,
findOne returns the first one (normally following insert order).
*/
function combineRoles(roles1, roles2) {
  return {
    ...roles2,
    ...roles1,
    projectRoles: [
      ...(roles2 ? roles2.projectRoles : []),
      ...(roles1 ? roles1.projectRoles : []),
    ],
  };
}

async function getAllUsersAndRoles() {
  const allRoles = await UserRoles().find().exec();
  const usersMap = allRoles
    .filter(roles => roles.userName) // only take users with known user names
    .reduce((uniqueUsersMap, roles) => { // convert to map, keyed by userId
      uniqueUsersMap[roles.userId] = combineRoles(uniqueUsersMap[roles.userId], addDefaults(roles)); // eslint-disable-line no-param-reassign
      return uniqueUsersMap;
    }, {});
  return Object.values(usersMap); // return users and roles
}

async function getProjectUsers(projectKey) {
  const query = { 'projectRoles.projectKey': { $eq: projectKey } };
  const projectUsers = await UserRoles().find(query).exec();
  return projectUsers.map(addDefaults);
}

async function addRecordForNewUser(userId, userName) {
  const allRoles = await UserRoles().find().exec();
  if (allRoles.filter(roles => roles.userId === userId).length > 0) {
    throw new Error(`Creating new user for ${userId} ${userName}, but they already exist`);
  }
  const user = {
    userId,
    userName,
    projectRoles: [],
  };
  if (allRoles.length === 0) {
    // Make the first ever user an instanceAdmin.
    user.instanceAdmin = true;
  }
  const roles = await UserRoles().create(user);
  return roles;
}

async function setInstanceAdmin(userId, instanceAdmin) {
  const users = await UserRoles().find({ userId }).exec();
  if (!users || users.length === 0) {
    throw new Error(`Unrecognised user ${userId}`);
  }
  await Promise.all(users.map((roles) => {
    roles[INSTANCE_ADMIN_ROLE_KEY] = instanceAdmin; // eslint-disable-line no-param-reassign
    const { _id } = roles;
    return UserRoles().findOneAndUpdate({ _id }, roles, { upsert: true, setDefaultsOnInsert: true, runValidators: true });
  }));
  return users.map(addDefaults)[0];
}

async function setCatalogueRole(userId, catalogueRole) {
  const users = await UserRoles().find({ userId }).exec();
  if (!users || users.length === 0) {
    throw new Error(`Unrecognised user ${userId}`);
  }
  await Promise.all(users.map((roles) => {
    roles[CATALOGUE_ROLE_KEY] = catalogueRole; // eslint-disable-line no-param-reassign
    const { _id } = roles;
    return UserRoles().findOneAndUpdate({ _id }, roles, { upsert: true, setDefaultsOnInsert: true, runValidators: true });
  }));
  return users.map(addDefaults)[0];
}

async function addRole(userId, projectKey, role) {
  // Load existing user
  const query = { userId };
  const user = await UserRoles().findOne(query).exec();

  if (!user) {
    throw new Error(`Unrecognised user ${userId}`);
  }
  // Either add role or update existing role
  const { projectRoles } = user;
  const roleIndex = findIndex(projectRoles, { projectKey });
  const roleAdded = roleIndex === -1;
  if (roleAdded) {
    projectRoles.push({ projectKey, role });
  } else {
    projectRoles[roleIndex].role = role;
  }
  await UserRoles().findOneAndUpdate(query, user, { upsert: true, setDefaultsOnInsert: true, runValidators: true });
  return roleAdded;
}

async function removeRole(userId, projectKey) {
  const query = { userId };
  const user = await UserRoles().findOne(query).exec();

  if (user) {
    const { projectRoles } = user;
    const roleIndex = findIndex(projectRoles, { projectKey });
    if (roleIndex > -1) {
      remove(projectRoles, { projectKey });
      const options = { upsert: true, setDefaultsOnInsert: true, runValidators: true };
      await UserRoles().findOneAndUpdate(query, user, options);
      return true;
    }
  }
  return false;
}

async function userIsMember(userId, projectKey) {
  const query = { userId: { $eq: userId }, 'projectRoles.projectKey': { $eq: projectKey } };
  return UserRoles().exists(query);
}

export default { combineRoles, getRoles, getUser, getUsers, getAllUsersAndRoles, getProjectUsers, setInstanceAdmin, setCatalogueRole, addRole, removeRole, userIsMember };
