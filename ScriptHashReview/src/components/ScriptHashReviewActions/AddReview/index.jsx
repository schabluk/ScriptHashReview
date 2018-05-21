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

class AddReview extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {scriptHash: '', rating: '0', comment: ''};

    this.handleChangeScriptHash = this.handleChangeScriptHash.bind(this);
    this.handleChangeRating = this.handleChangeRating.bind(this);
    this.handleChangeComment = this.handleChangeComment.bind(this);

    this.handleAddReview = this.handleAddReview.bind(this);
  }

  static propTypes = {
      scriptHashScriptHashReview: string
    };

    static defaultProps = {
      scriptHashScriptHashReview: 'cdf4cdad9a6c201b5501125e4c87e02b65a363f2'
    };

  handleChangeScriptHash(event) { this.setState({scriptHash: event.target.value}); }
  handleChangeRating(event) { this.setState({rating: event.target.value}); }
  handleChangeComment(event) { this.setState({comment: event.target.value}); }

  handleAddReview = async () =>
  {
    const { scriptHash, rating, comment } = this.state;
    const { scriptHashScriptHashReview } = this.props;

    const myAddress = await this.props.nos.getAddress();
    const encodedAddress = await unhexlify(u.reverseHex(wallet.getScriptHashFromAddress(myAddress)));

    const args = [encodedAddress, scriptHash, rating, comment];
    alert(args);

    alert(JSON.stringify(await this.props.nos.testInvoke(scriptHashScriptHashReview, 'addReview', args)));
  }


  render() {
    return (
      <div>

          <label>
            ScriptHash:
            <input type="text" value={this.state.scriptHash} onChange={this.handleChangeScriptHash}/>
          </label>
          <label>
          Rate this script hash:
          <select value={this.state.rating} onChange={this.handleChangeRating}>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <label>
          Comment:
          <textarea value={this.state.comment} onChange={this.handleChangeComment} />
        </label>
        <button onClick={this.handleAddReview}>
          Add review
        </button>
        <p>fqsdfs</p>
      </div>
    );
  }

}

AddReview.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  nos: nosPropTypes.isRequired
};

export default injectNOS(injectSheet(styles)(AddReview));
