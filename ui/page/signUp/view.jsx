// @flow
import React from 'react';
import UserSignUp from 'component/userSignUp';
import Page from 'component/page';

export default function SignInPage() {
  return (
    <Page authPage className="main--auth-page">
      <UserSignUp />
    </Page>
  );
}
