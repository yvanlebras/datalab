import React from 'react';
import PropTypes from 'prop-types';
import StacksContainer from '../stacks/StacksContainer';
import { MODAL_TYPE_CREATE_SITE, MODAL_TYPE_EDIT_SITE } from '../../constants/modaltypes';
import EditStackForm from '../../components/stacks/EditStackForm';

export const CONTAINER_TYPE = 'publish';
export const TYPE_NAME = 'Site';
export const TYPE_NAME_PLURAL = 'Sites';
export const FORM_NAME = 'createSite';

const SitesContainer = ({ userPermissions }) => (
  <StacksContainer
    typeName={TYPE_NAME}
    typeNamePlural={TYPE_NAME_PLURAL}
    containerType={CONTAINER_TYPE}
    dialogAction={MODAL_TYPE_CREATE_SITE}
    editDialogAction={MODAL_TYPE_EDIT_SITE}
    formStateName={FORM_NAME}
    formComponent={EditStackForm}
    userPermissions={userPermissions} />
);

SitesContainer.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SitesContainer;
