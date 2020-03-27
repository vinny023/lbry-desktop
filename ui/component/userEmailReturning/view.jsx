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
import usePersistedState from 'effects/use-persisted-state';
import UserEmailVerify from 'component/userEmailVerify';

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
  const { errorMessage, doUserSignIn, emailToVerify } = props;
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = usePersistedState('sign-in-show-password', false);
  const [password, setPassword] = useState('');
  const valid = email.match(EMAIL_REGEX);
  const showEmailVerification = emailToVerify;

  function handleSubmit() {
    analytics.emailProvidedEvent();
    doUserSignIn(email, password === '' ? undefined : password);

    // @if TARGET='app'
    setShareDiagnosticData(true);
    // @endif
  }

  return showEmailVerification ? (
    <UserEmailVerify />
  ) : (
    <div>
      <h1 className="section__title--large">{__('Sign In to lbry.tv')}</h1>
      <Form onSubmit={handleSubmit} className="section__body">
        <FormField
          autoFocus
          placeholder={__('hotstuff_96@hotmail.com')}
          type="email"
          name="sign_in_email"
          label={__('Email')}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {showPassword && (
          <FormField
            placeholder="•••••••••••"
            type="password"
            name="sign_in_password"
            label={__('Password')}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        )}
        <fieldset-section>
          <FormField
            type="checkbox"
            placeholder={__('hotstuff_96@hotmail.com')}
            name="sign_in_toggle_password"
            label={__('Sign in with a password')}
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
        </fieldset-section>

        <div className="section__actions">
          <Button button="primary" type="submit" label={__('Continue')} disabled={!email || !valid} />
          {errorMessage && <div className="error-text">{errorMessage}</div>}
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
    </div>
  );
}

export default UserEmailReturning;
