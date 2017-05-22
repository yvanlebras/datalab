import convict from 'convict';

// Define a schema
const config = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  proxyPort: {
    doc: 'The port for the Proxy service.',
    format: 'port',
    default: 8080,
    env: 'PROXY_PORT',
  },
  apiPort: {
    doc: 'The port for the API service.',
    format: 'port',
    default: 8081,
    env: 'PROXY_API_PORT',
  },
  etcdHost: {
    doc: 'The IP address for the ETCD host',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'PROXY_ETCD_IP_ADDRESS',
  },
  etcdPort: {
    doc: 'The port for the ETCD service.',
    format: 'port',
    default: 2379,
    env: 'PROXY_ETCD_PORT',
  },
  redbirdEtcdKey: {
    doc: 'Redbird Base ETCD key',
    format: String,
    default: 'redbird',
    env: 'PROXY_REDBIRD_ETCD_KEY',
  },
  ssl: {
    key: {
      doc: 'Private SSL Key',
      format: String,
      default: '/etc/ssl/private/datalabskey.pem',
      env: 'PROXY_SSL_KEY',
    },
    cert: {
      doc: 'Certificate Chain',
      format: String,
      default: '/etc/ssl/certs/datalabs.pem',
      env: 'PROXY_SSL_CERT',
    },
  },
});

export default config;
