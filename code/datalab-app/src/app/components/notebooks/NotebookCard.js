import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Image } from 'semantic-ui-react';
import notebookDescriptions from './notebookDescriptions';

const NotebookCard = ({ notebook, openNotebook }) => {
  const description = notebookDescriptions[notebook.type].description;
  const logo = notebookDescriptions[notebook.type].logo;

  return (
    <Card>
      <Card.Content>
        <Image floated='right' size='tiny' src={logo} />
        <Card.Header>
          {notebook.displayName}
        </Card.Header>
        <Card.Meta>
          {capitalizeString(notebook.type)}
        </Card.Meta>
        <Card.Description>
          {description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button primary fluid onClick={() => openNotebook(notebook.redirectUrl)}>
          Open
        </Button>
      </Card.Content>
    </Card>
  );
};

NotebookCard.propTypes = {
  notebook: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    redirectUrl: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  openNotebook: PropTypes.func.isRequired,
};

function capitalizeString(text) {
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

export default NotebookCard;
