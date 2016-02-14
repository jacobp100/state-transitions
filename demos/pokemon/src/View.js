import React from 'react';
import { capitalize } from 'lodash';
import { Link } from 'react-router';
import { TweenState } from '../../../src/index';

import pokemon from '../data/pokemon.json';


export default class View extends React.Component {
  render() {
    const { id } = this.props.params;

    const { name, type, attack, defense, levels, evolveLevel, evolveTo, moves, probability, curve } = pokemon[id];

    let levelsElement;
    let evolveElement;
    let probabilityElement;

    if (evolveLevel !== undefined && evolveTo !== undefined) {
      evolveElement = [
        <tr key="0">
          <td className="table__title">Evolve Level</td>
          <td className="table__value">{ evolveLevel }</td>
        </tr>,
        <tr key="1">
          <td className="table__title">Evolve To</td>
          <td className="table__value">{ evolveTo }</td>
        </tr>,
      ];
    }

    if (levels !== undefined) {
      levelsElement = (
        <tr>
          <td className="table__title">Levels</td>
          <td className="table__value">{ levels.join(', ') }</td>
        </tr>
      );
    }

    if (probability !== undefined) {
      probabilityElement = (
        <tr>
          <td className="table__title">Probability</td>
          <td className="table__value">{ probability }</td>
        </tr>
      );
    }

    return (
      <TweenState id={ `frame-${id}` }>
        <div className={ `view` }>
          <div className={ `frame frame--${type}` }>
            <div className={ `frame__body details` }>
              <TweenState id={ `image-${id}` }>
                <img className="details__image" src={ `resources/pokemon/${id}.png` } />
              </TweenState>
              <div className="details__table-container">
                <table className="details__table table">
                  <tbody>
                    <tr>
                      <td className="table__title">Name</td>
                      <td className="table__value">{ name }</td>
                    </tr>
                    <tr>
                      <td className="table__title">Type</td>
                      <td className="table__value">{ capitalize(type) }</td>
                    </tr>
                    <tr>
                      <td className="table__title">Attack</td>
                      <td className="table__value">{ attack }</td>
                    </tr>
                    <tr>
                      <td className="table__title">Defense</td>
                      <td className="table__value">{ defense }</td>
                    </tr>
                    { levelsElement }
                    { evolveElement }
                    <tr>
                      <td className="table__title">Moves</td>
                      <td className="table__value">{ moves.map(capitalize).join(', ') }</td>
                    </tr>
                    { probabilityElement }
                    <tr>
                      <td className="table__title">Curve</td>
                      <td className="table__value">{ curve }</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <TweenState id={ `label-${id}` }>
              <Link className={ `label label--huge label--${type}` } to="/">
                Back
              </Link>
            </TweenState>
          </div>
        </div>
      </TweenState>
    );
  }
}

View.propTypes = {
  params: React.PropTypes.object,
};
