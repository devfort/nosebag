import React, { Component } from 'react';

class About extends Component {
  render() {
    return <article className='about'>
      <h2>About <i>nosebag</i></h2>
      <p>Nosebag was built at Silverton Stables, a Landmark Trust property near Exeter, at <a target='_blank' href='https://devfort.com/fort/12/'>/dev/fort 12</a>.</p>
      <p>
      As is typical for /dev/fort, we arrived with no idea of what we might build, or even with everyone knowing everyone else. After settling in on the first night, it became obvious that there were a range of problems around cooking that seemed interesting. The most tractable turned out to be managing a shopping list for multiple recipes.
      </p>
      <p>
      We've made available recipes for the food we cooked during our week at Silverton.
      </p>
      <blockquote>
      <p>We hope you like it.</p>
      <p><cite>James, James, Norm, and Rachel</cite></p>
      </blockquote>
      </article>;
  }
}

export default About;
