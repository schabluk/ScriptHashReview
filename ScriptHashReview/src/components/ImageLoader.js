import React from "react";
import PropTypes from "prop-types";

class ImageLoader extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    style: {
      width: "32px",
      height: "32px"
    }
  };

  state = {
    loaded: false
  };

  constructor(props) {
    super(props);

    const image = new Image();

    image.onload = e => this.setState({ loaded: true });
    image.onerror = e => this.setState({ loaded: false });
    image.src = this.props.src;
  }

  render() {
    const { src, alt, style } = this.props;

    const image = this.state.loaded
      ? src
      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXYzix/zkABMECb+U/1xQAAAAASUVORK5CYII=";

    return <img style={style} src={image} alt={alt} />;
  }
}

export default ImageLoader;
