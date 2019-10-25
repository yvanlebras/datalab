import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { startCase } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Downshift from 'downshift';
import userActions from '../../actions/userActions';
import projectSettingsActions from '../../actions/projectSettingsActions';
import { SORTED_PERMISSIONS } from '../../constants/permissions';
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';
import { useUsers } from '../../hooks/usersHooks';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';

const styles = theme => ({
  addUserPermission: {
    display: 'flex',
    width: '100%',
    margin: 0,
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(1),
  },
  dropDownClosed: {
    display: 'none',
  },
  dropDownOpen: {
    position: 'absolute',
    zIndex: 1,
    overflow: 'auto',
    maxHeight: 400,
  },
  permissionsSelector: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    minWidth: 95,
  },
  usersAutofill: {
    flexGrow: 1,
  },
  addButton: {
    // Styling makes button match size and margins of the outlined text fields
    height: 40,
    marginTop: 8,
    marginBottom: 4,
  },
});

const PERMISSIONS = SORTED_PERMISSIONS.map(item => startCase(item.name));

function AddUserPermission({ classes }) {
  const users = useUsers();
  const projectKey = useCurrentProjectKey().value;
  const dispatch = useDispatch();
  const [selectedPermissions, setSelectedPermissions] = useState(PERMISSIONS[PERMISSIONS.length - 1]);
  const [selectedUserName, setSelectedUserName] = useState('');

  useEffect(() => {
    dispatch(userActions.listUsers());
  }, [dispatch]);

  return <PureAddUserPermission
    users={users}
    projectKey={projectKey}
    permissionLevels={PERMISSIONS}
    selectedPermissions={selectedPermissions} setSelectedPermissions={setSelectedPermissions}
    selectedUserName={selectedUserName} setSelectedUserName={setSelectedUserName}
    dispatch={dispatch}
    classes={classes}
  />;
}

export function PureAddUserPermission({
  users, projectKey, permissionLevels, selectedPermissions, setSelectedPermissions, selectedUserName, setSelectedUserName, dispatch, classes,
}) {
  const userNames = users.value.map(user => user.name);

  return (
    <div className={classes.addUserPermission}>
      <UsersAutofill userNames={userNames} setSelectedUserName={setSelectedUserName} classes={classes} />
      <PermissionsSelector
        className={classes.permissionsSelector}
        permissionLevels={permissionLevels}
        selectedPermissions={selectedPermissions}
        setSelectedPermissions={setSelectedPermissions}
        classes={classes} />
      <AddUserButton
        userInformation={users.value}
        selectedUserName={selectedUserName}
        projectKey={projectKey}
        onClickFn={dispatchAddUserAction}
        dispatch={dispatch}
        selectedPermissions={selectedPermissions}
        classes={classes}/>

    </div>
  );
}

export function UsersAutofill({ userNames, setSelectedUserName, classes }) {
  return (
    <Downshift>
      {
        ({
          isOpen,
          inputValue,
          getInputProps,
          getMenuProps,
          getItemProps,
        }) => {
          setSelectedUserName(inputValue);
          return (
            <div className={classes.usersAutofill}>
              <TextField
                label="Add User"
                placeholder="Type user's email..."
                variant="outlined"
                margin="dense"
                fullWidth
                {...getInputProps()} />
              <UsersDropdown
                userNames={userNames}
                inputValue={inputValue}
                getMenuProps={getMenuProps}
                getItemProps={getItemProps}
                isOpen={isOpen}
                classes={classes} />
            </div>
          );
        }
      }
    </Downshift>
  );
}

export function UsersDropdown({ userNames, inputValue, getMenuProps, getItemProps, isOpen, classes }) {
  const namesMatchingSearch = userNames.filter(name => name.search(inputValue) !== -1);

  const show = isOpen && namesMatchingSearch.length > 0;
  return (
    <Paper
      className={show ? classes.dropDownOpen : classes.dropDownClosed}
      {...getMenuProps()}
    >
      {show
        ? namesMatchingSearch
          .map(userName => <MenuItem {...getItemProps({ item: userName, key: userName })}>{userName}</MenuItem>)
        : null}
    </Paper>
  );
}

export function PermissionsSelector({ permissionLevels, selectedPermissions, setSelectedPermissions, classes }) {
  return (
    <TextField
      className={classes.permissionsSelector}
      label="Permissions"
      variant="outlined"
      margin="dense"
      select
      value={selectedPermissions}
      onChange={event => setSelectedPermissions(event.target.value)}
    >
      {permissionLevels.map(item => <MenuItem value={item} key={item}>{item}</MenuItem>)}
    </TextField>
  );
}

export function AddUserButton({ userInformation, selectedUserName, projectKey, selectedPermissions, onClickFn, dispatch, classes }) {
  const selectedUser = userInformation.find(user => user.name === selectedUserName);
  return (
    <PrimaryActionButton
      className={classes.addButton}
      disabled={!selectedUser}
      onClick={() => onClickFn(projectKey, selectedUser, selectedPermissions, dispatch)}
    >
      Add
    </PrimaryActionButton>
  );
}

export function dispatchAddUserAction(projectKey, user, selectedPermissions, dispatch) {
  dispatch(
    projectSettingsActions.addUserPermission(
      projectKey, user, selectedPermissions.toLowerCase(),
    ),
  );
}

export default withStyles(styles)(AddUserPermission);
