import validate from 'validate.js';
import internalNameCheckerActions from '../../actions/internalNameCheckerActions';
import { getNotebookInfo } from '../../config/images';

const constraints = {
  displayName: {
    presence: true,
  },
  type: {
    presence: true,
  },
  name: {
    presence: true,
    format: {
      pattern: '^[a-z0-9]+$',
      message: 'must be lower case characters without a space',
    },
    length: {
      minimum: 4,
      maximum: 16,
    },
  },
  volumeMount: {
    presence: {
      allowEmpty: false,
    },
  },
  description: {
    presence: true,
  },
  shared: {
    presence: {
      allowEmpty: false,
    },
  },
};

validate.formatters.reduxForm = errors => errors.reduce(errorReducer, {});

function errorReducer(accumulator, error) {
  accumulator[error.attribute] = error.error; // eslint-disable-line no-param-reassign
  return accumulator;
}

export const syncValidate = values => validate(values, constraints, { format: 'reduxForm' });

// disable no throw literal for async validation options as need to throw objects for
// redux form validation
/* eslint-disable no-throw-literal */

const asyncValidateName = async (values, dispatch, projectKey) => {
  let response;
  try {
    response = await dispatch(internalNameCheckerActions.checkNameUniqueness(projectKey, values.name));
  } catch (error) {
    throw { name: 'Unable to check if Notebook URL Name is unique.' };
  }
  if (!response.value) {
    throw { name: 'Another resource is already using this name and names must be unique.' };
  }
};

const asyncValidateType = async (values) => {
  const validTypes = Object.keys(await getNotebookInfo());
  if (!validTypes.includes(values.type)) {
    throw { type: `Type must be one of ${validTypes}` };
  }
};

/* eslint-enable no-throw-literal */

// Catch statement added to prevent submission of creation request without passing uniqueness check.
export const getAsyncValidate = (nameFieldName, typeFieldName) => async (values, dispatch, { projectKey }, blurredField) => {
  let result;
  if (blurredField === nameFieldName) result = asyncValidateName(values, dispatch, projectKey);
  if (blurredField === typeFieldName) result = asyncValidateType(values);
  return result;
};
