import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';
import { renderTextField, renderSelectField, renderTextArea, CreateFormControls } from '../common/form/controls';
import { syncValidate, asyncValidate } from './newDataStoreFormValidator';
import { storageCreationAllowedDisplayOptions } from '../../config/storage';

const CreateDataStoreForm = (props) => {
  const { handleSubmit, cancel, submitting } = props;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field
          name="displayName"
          label="Display Name"
          placeholder="Display Name"
          component={renderTextField} />
      </div>
      <div>
        <Field
          name="type"
          label="Storage Type"
          placeholder="Storage Type"
          component={renderSelectField}
          options={storageCreationAllowedDisplayOptions()} />
      </div>
      <div>
        <Field
          name="volumeSize"
          label="Storage Size (GB)"
          placeholder="GB"
          component={renderTextField}
          type="number"
          InputProps={{ inputProps: { min: 5, max: 200 } }}
          parse={value => Number(value)} />
      </div>
      <div>
        <Field
          name="name"
          label="Internal Name"
          placeholder="Internal Name"
          component={renderTextField} />
      </div>
      <div>
        <Field
          name="description"
          label="Description"
          placeholder="Description"
          component={renderTextArea} />
      </div>
      <CreateFormControls onCancel={cancel} submitting={submitting} fullWidthButtons/>
    </form>
  );
};

CreateDataStoreForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  projectKey: PropTypes.string.isRequired,
};

const CreateDataStoreReduxFrom = reduxForm({
  form: 'createDataStore',
  validate: syncValidate,
  asyncValidate,
  asyncBlurFields: ['name'],
  destroyOnUnmount: false,
  enableReinitialize: true, // update form state when defaults set
})(CreateDataStoreForm);

export { CreateDataStoreForm as PureCreateDataStoreForm };
export default CreateDataStoreReduxFrom;
