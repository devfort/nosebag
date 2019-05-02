import React, { Component } from 'react';

export class Quantity extends Component {
  render() {
    if (this.props.quantity) {
      return <i className='quantity'>{ this.props.quantity.toString() }</i>;
    } else {
      return <i className='quantity'>some</i>;
    }
  }
}

export class Serves extends Component {
  render() {
    if (this.props.serves) {
      return <p className='serves'>
        Serves {this.props.serves}<b>.</b>
      </p>;
    } else {
      return '';
    }
  }
}
