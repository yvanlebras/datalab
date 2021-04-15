import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Page from './Page';
import ClustersContainer from '../containers/clusters/ClustersContainer';
import ExternalLink from '../components/common/ExternalLink';

const useStyles = makeStyles(theme => ({
  clusterList: {
    marginTop: theme.spacing(5),
  },
}));

const CLUSTER_TYPE = 'DASK';

const DaskPage = () => {
  const classes = useStyles();

  return (
    <Page title="Dask">
      <Typography variant="body1">
        <ExternalLink href="https://dask.org/">Dask</ExternalLink> is a flexible parallel computing library for analytic computing in Python.
        DataLabs allows users to create Dask clusters for use within projects.
        These clusters can be utilised from notebooks using the <ExternalLink href="https://kubernetes.dask.org/en/latest/">Dask Kubernetes</ExternalLink> package when configured to use the specified scheduler address for the cluster.
        Dask can only be used with Python.
      </Typography>
      <ClustersContainer className={classes.clusterList} clusterType={CLUSTER_TYPE} />
    </Page>
  );
};

export default DaskPage;
