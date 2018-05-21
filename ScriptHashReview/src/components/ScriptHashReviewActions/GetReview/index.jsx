import React from "react";
import injectSheet from "react-jss";
import { PropTypes, bool, string, func } from 'prop-types';
import { nosPropTypes } from "@nosplatform/api-functions/es6";
import { u, sc, wallet } from "@cityofzion/neon-js";
import { unhexlify } from "binascii";

import { injectNOS } from "../../../nos";

const styles = {
  button: {
  margin: "16px",
  fontSize: "14px"
  }
};

class GetReview extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {address: '', scriptHash: ''};

    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangeScriptHash = this.handleChangeScriptHash.bind(this);

    this.handleGetReview = this.handleGetReview.bind(this);
  }

  static propTypes = {
      scriptHashScriptHashReview: string
    };

    static defaultProps = {
      scriptHashScriptHashReview: 'cdf4cdad9a6c201b5501125e4c87e02b65a363f2'
    };

  handleChangeAddress(event) { this.setState({address: event.target.value}); }
  handleChangeScriptHash(event) { this.setState({scriptHash: event.target.value}); }


  handleGetReview = async () =>
  {
    const { address, scriptHash } = this.state;
    const { scriptHashScriptHashReview } = this.props;

    const encodedAddress = await unhexlify(u.reverseHex(wallet.getScriptHashFromAddress(address)));

    const args = [encodedAddress, scriptHash];

    alert(JSON.stringify(await this.props.nos.testInvoke(scriptHashScriptHashReview, 'getReview', args)));
  }


  render() {
    return (
      <div>
        <h1>Get review</h1>
        <label>
          Address:
          <input type="text" value={this.state.address} onChange={this.handleChangeAddress}/>
        </label>
        <label>
          ScriptHash:
          <input type="text" value={this.state.scriptHash} onChange={this.handleChangeScriptHash}/>
        </label>
        <button onClick={this.handleGetReview}>
          Get review
        </button>
      </div>
    );
  }

}

GetReview.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  nos: nosPropTypes.isRequired
};

export default injectNOS(injectSheet(styles)(GetReview));
