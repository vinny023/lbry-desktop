// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import UserEmailReturning from 'component/userEmailReturning';
import UserEmailVerify from 'component/userEmailVerify';
import UserFirstChannel from 'component/userFirstChannel';
import UserChannelFollowIntro from 'component/userChannelFollowIntro';
import UserTagFollowIntro from 'component/userTagFollowIntro';
import { DEFAULT_BID_FOR_FIRST_CHANNEL } from 'component/userFirstChannel/view';
import { rewards as REWARDS, YOUTUBE_STATUSES } from 'lbryinc';
import UserVerify from 'component/userVerify';
import Spinner from 'component/spinner';
import YoutubeTransferStatus from 'component/youtubeTransferStatus';
import SyncPassword from 'component/syncPassword';
import useFetched from 'effects/use-fetched';
import usePersistedState from 'effects/use-persisted-state';
import Confetti from 'react-confetti';

type Props = {
  user: ?User,
  emailToVerify: ?string,
  channels: ?Array<string>,
  balance: ?number,
  fetchingChannels: boolean,
  claimingReward: boolean,
  claimReward: () => void,
  fetchUser: () => void,
  claimedRewards: Array<Reward>,
  history: { replace: string => void },
  location: { search: string },
  youtubeChannels: Array<any>,
  syncEnabled: boolean,
  hasSynced: boolean,
  syncingWallet: boolean,
  getSyncError: ?string,
  creatingChannel: boolean,
};

function UserSignIn(props: Props) {
  const { user, location, history } = props;
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const redirect = urlParams.get('redirect');
  const showUserEmail = user && !user.password_set && !user.has_verified_email;

  React.useEffect(() => {
    if (!showUserEmail) {
      history.push(redirect || '/');
    }
  }, [showUserEmail]);

  return <section className="main--contained">{showUserEmail && <UserEmailReturning />}</section>;
}

export default withRouter(UserSignIn);
