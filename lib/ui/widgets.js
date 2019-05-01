import React, { Component } from 'react';

class Quantity extends Component {
  render() {
    if (this.props.quantity) {
      return <i className='quantity'>{ this.props.quantity.toString() }</i>;
    } else {
      return <i className='quantity'>some</i>;
    }
  }
}

export default Quantity;
