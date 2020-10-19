import React from 'react';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from './ResourceAccordion';
import ProjectSitesContainer from './ProjectSitesContainer';

export default function ProjectSites(props) {
  const { project, userPermissions } = props;

  return (
    <ResourceAccordion defaultExpanded>
      <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Sites</Typography>
      </ResourceAccordionSummary>
      <ResourceAccordionDetails>
        <ProjectSitesContainer userPermissions={userPermissions} project={project} />
      </ResourceAccordionDetails>
    </ResourceAccordion>
  );
}
