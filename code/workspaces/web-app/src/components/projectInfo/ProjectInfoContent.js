import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

const ProjectInfoContent = ({ projectInfo }) => (
  <div>
    <Typography variant='h5'>{projectInfo.id}: {projectInfo.displayName}</Typography>
    <p>
      {projectInfo.description}
    </p>
  </div>
);

ProjectInfoContent.propTypes = {
  projectInfo: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default ProjectInfoContent;
