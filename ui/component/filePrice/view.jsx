// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import CreditAmount from 'component/common/credit-amount';
import Icon from 'component/common/icon';

type Props = {
  showFullPrice: boolean,
  costInfo: ?{ includesData: boolean, cost: number },
  fetchCostInfo: string => void,
  uri: string,
  fetching: boolean,
  claim: ?{},
  // below props are just passed to <CreditAmount />
  inheritStyle?: boolean,
  showLBC?: boolean,
  hideFree?: boolean, // hide the file price if it's free
  claimWasPurchased: boolean,
  large: boolean,
};

class FilePrice extends React.PureComponent<Props> {
  static defaultProps = {
    showFullPrice: false,
  };

  componentDidMount() {
    this.fetchCost(this.props);
  }

  componentDidUpdate() {
    this.fetchCost(this.props);
  }

  fetchCost = (props: Props) => {
    const { costInfo, fetchCostInfo, uri, fetching, claim } = props;

    if (costInfo === undefined && !fetching && claim) {
      fetchCostInfo(uri);
    }
  };

  render() {
    const { costInfo, showFullPrice, showLBC, hideFree, claimWasPurchased, large } = this.props;

    if (!costInfo || !costInfo.cost || (!costInfo.cost && hideFree)) {
      return null;
    }

    return claimWasPurchased ? (
      <span className={classnames('file-properties__purchased', { 'file-properties__purchased--large': large })}>
        <Icon icon={ICONS.PURCHASED} size={large ? 22 : undefined} />
      </span>
    ) : (
      <CreditAmount
        className={classnames('file-properties__not-purchased', { 'file-properties__not-purchased--large': large })}
        showFree
        badge={false}
        showLBC={showLBC}
        amount={costInfo.cost}
        isEstimate={!costInfo.includesData}
        showFullPrice={showFullPrice}
      />
    );
  }
}

export default FilePrice;
