import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import { TweenState, AnimateInOut } from '../../../src/index';

import pokemon from '../data/pokemon.json';


export default class List extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.state = { search: '' };
  }

  onChange(e) {
    this.setState({ search: e.target.value });
  }

  render() {
    const { search } = this.state;

    const pokeItems = _(pokemon)
      .pick(({ name }) => (
        _.includes(name.toLowerCase(), search)
      ))
      .mapValues(({ name, type }, id) => (
        <Link key={ id } className={ `icon` } to={ `view/${id}` }>
          <TweenState id={ `frame-${id}` }>
            <div className={ `frame frame--${type}` }>
              <div className="frame__body image-container">
                <TweenState id={ `image-${id}` }>
                  <img className="image-container__image" src={ `resources/pokemon/${id}.png` } />
                </TweenState>
              </div>
              <TweenState id={ `label-${id}` }>
                <span className={ `label label--${type}` }>
                  { name }
                </span>
              </TweenState>
            </div>
          </TweenState>
        </Link>
      ))
      .values()
      .value();

    return (
      <AnimateInOut animateOutClassName="link-view--leaving">
        <div className="link-view">
          <input type="text" className="search" placeholder="Search&hellip;" onChange={ this.onChange } />
          <div>
            { pokeItems }
          </div>
        </div>
      </AnimateInOut>
    );
  }
}
