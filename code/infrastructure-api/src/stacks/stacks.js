import { find } from 'lodash';
import jupyterStack from './jupyterStack';
import rstudioStack from './rstudioStack';
import zeppelinStack from './zeppelinStack';

const STACKS = Object.freeze({
  JUPYTER: {
    name: 'jupyter',
    create: jupyterStack.createJupyterNotebook,
    delete: jupyterStack.deleteJupyterNotebook,
  },
  ZEPPELIN: {
    name: 'zeppelin',
    create: zeppelinStack.createZeppelinStack,
    delete: zeppelinStack.deleteZeppelinStack,
  },
  RSTUDIO: {
    name: 'rstudio',
    create: rstudioStack.createRStudioStack,
    delete: rstudioStack.deleteRStudioStack,
  },
});

const getStack = name => find(STACKS, ['name', name]);

export default getStack;
