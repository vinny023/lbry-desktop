// @flow
import * as PAGES from 'constants/pages';
import React, { useState } from 'react';
import { Lbryio } from 'lbryinc';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import analytics from 'analytics';
import { EMAIL_REGEX } from 'constants/email';
import I18nMessage from 'component/i18nMessage';
import { useHistory } from 'react-router-dom';

type Props = {
  errorMessage: ?string,
  isPending: boolean,
  addUserEmail: string => void,
  syncEnabled: boolean,
  setSync: boolean => void,
  balance: number,
  daemonSettings: { share_usage_data: boolean },
  setShareDiagnosticData: boolean => void,
};

function UserEmailReturning(props: Props) {
  const { errorMessage, isPending, addUserEmail, setSync, daemonSettings, setShareDiagnosticData } = props;
  const { share_usage_data: shareUsageData } = daemonSettings;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localShareUsageData, setLocalShareUsageData] = React.useState(false);
  const [formSyncEnabled, setFormSyncEnabled] = useState(true);
  const { replace } = useHistory();
  const valid = email.match(EMAIL_REGEX);

  function handleUsageDataChange() {
    setLocalShareUsageData(!localShareUsageData);
  }

  // function handleSubmit() {
  //   setSync(formSyncEnabled);
  //   addUserEmail(email);
  //   // @if TARGET='app'
  //   setShareDiagnosticData(true);
  //   // @endif
  //   analytics.emailProvidedEvent();
  // }

  function handleSubmit() {
    replace(`/$/${PAGES.AUTH}?email_prefill=${email}`);
    // Lbryio.call('user_email', 'new', { email, password }, 'post').catch(error => {
    //   // If exists, ignore?

    //   Lbryio.call('user_password', 'login', { email: email, password }).then(response => {
    //     // If succeess
    //     window.location.href = '/';
    //   });
    // });
  }

  return (
    <React.Fragment>
      <h1 className="section__title--large">{__('Sign In with lbry.tv')}</h1>
      <Form onSubmit={handleSubmit} className="section__body">
        <FormField
          autoFocus
          placeholder={__('hotstuff_96@hotmail.com')}
          type="email"
          name="sign_up_email"
          label={__('Email')}
          value={email}
          error={errorMessage}
          onChange={e => setEmail(e.target.value)}
        />

        <div className="card__actions">
          <Button
            button="primary"
            type="submit"
            label={__('Continue')}
            disabled={!email || !valid || (!IS_WEB && !localShareUsageData && !shareUsageData) || isPending}
          />
        </div>
      </Form>
      <p className="help">
        <I18nMessage
          tokens={{
            sign_up: <Button button="link" navigate={`/$/${PAGES.AUTH_SIGNUP}`} label={__('Sign Up')} />,
          }}
        >
          Don't have an account? %sign_up%
        </I18nMessage>
      </p>
    </React.Fragment>
  );
}

export default UserEmailReturning;
