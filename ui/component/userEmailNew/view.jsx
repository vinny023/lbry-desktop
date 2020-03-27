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

function UserEmailNew(props: Props) {
  const { errorMessage, isPending, doSignIn, setSync, daemonSettings, setShareDiagnosticData } = props;
  const { share_usage_data: shareUsageData } = daemonSettings;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = usePersistedState('sign-up-show-password', false);
  const [localShareUsageData, setLocalShareUsageData] = React.useState(false);
  const [formSyncEnabled, setFormSyncEnabled] = useState(true);
  const { replace } = useHistory();
  const valid = email.match(EMAIL_REGEX);

  console.log('error', errorMessage);
  function handleUsageDataChange() {
    setLocalShareUsageData(!localShareUsageData);
  }

  function handleSubmit() {
    setSync(formSyncEnabled);
    doSignIn(email, password === '' ? undefined : password);
    // @if TARGET='app'
    setShareDiagnosticData(true);
    // @endif
    analytics.emailProvidedEvent();
  }

  return (
    <React.Fragment>
      <h1 className="section__title--large">{__('Sign Up with lbry.tv')}</h1>
      {/* @if TARGET='app' */}
      <p className="section__subtitle">
        {__('An account with lbry.tv allows you to earn rewards and backup your data.')}
      </p>
      {/* @endif */}
      <Form onSubmit={handleSubmit} className="section__body">
        <FormField
          autoFocus
          placeholder={__('hotstuff_96@hotmail.com')}
          type="email"
          name="sign_up_email"
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
            label={__('Protect your account with a password')}
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
        </fieldset-section>

        {!IS_WEB && (
          <FormField
            type="checkbox"
            name="sync_checkbox"
            label={
              <React.Fragment>
                {__('Backup your account and wallet data.')}{' '}
                <Button button="link" href="https://lbry.com/faq/account-sync" label={__('Learn More')} />
              </React.Fragment>
            }
            checked={formSyncEnabled}
            onChange={() => setFormSyncEnabled(!formSyncEnabled)}
          />
        )}

        {!shareUsageData && !IS_WEB && (
          <FormField
            type="checkbox"
            name="share_data_checkbox"
            checked={localShareUsageData}
            onChange={handleUsageDataChange}
            label={
              <React.Fragment>
                {__('Share usage data with LBRY inc.')}{' '}
                <Button button="link" href="https://lbry.com/faq/privacy-and-data" label={__('Learn More')} />
                {!localShareUsageData && <span className="error-text"> ({__('Required')})</span>}
              </React.Fragment>
            }
          />
        )}
        <div className="section__actions">
          <Button
            button="primary"
            type="submit"
            label={__('Continue')}
            disabled={!email || !valid || (!IS_WEB && !localShareUsageData && !shareUsageData) || isPending}
          />
          {errorMessage && (
            <p className="error-text">{typeof errorMessage === 'object' ? errorMessage.message : errorMessage}</p>
          )}
        </div>
      </Form>
      {/* @if TARGET='web' */}
      <p className="help">
        <I18nMessage
          tokens={{
            terms: <Button button="link" href="https://www.lbry.com/termsofservice" label={__('Terms of Service')} />,
          }}
        >
          By continuing, I agree to the %terms% and confirm I am over the age of 13.
        </I18nMessage>
      </p>
      <p className="help">
        <I18nMessage
          tokens={{
            sign_in: <Button button="link" navigate={`/$/${PAGES.AUTH}`} label={__('Sign In')} />,
          }}
        >
          Already have an account? %sign_in%
        </I18nMessage>
      </p>
      {/* @endif */}
    </React.Fragment>
  );
}

export default UserEmailNew;
