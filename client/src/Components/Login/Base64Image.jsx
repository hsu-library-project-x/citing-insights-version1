import React from 'react'

class Base64Image extends React.Component {
  constructor(props) {
    super(props);
    this.arrayBufferToBase64 = this.arrayBufferToBase64.bind(this);
  }

  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };


  render() {
    let imageStr = this.arrayBufferToBase64( this.props.imageBase64String);
    return (<img width={750} height={500}
      src={"data:image/jpeg;base64, " +
        imageStr}
    />)
  }
}

export default Base64Image;