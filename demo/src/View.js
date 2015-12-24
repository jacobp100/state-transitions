import React from 'react';
import { capitalize } from 'lodash';
import { Link } from 'react-router';
import { TweenState } from '../../src/index';

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
          <td className="table-title">Evolve Level</td>
          <td className="table-value">{ evolveLevel }</td>
        </tr>,
        <tr key="1">
          <td className="table-title">Evolve To</td>
          <td className="table-value">{ evolveTo }</td>
        </tr>,
      ];
    }

    if (levels !== undefined) {
      levelsElement = (
        <tr>
          <td className="table-title">Levels</td>
          <td className="table-value">{ levels.join(', ') }</td>
        </tr>
      );
    }

    if (probability !== undefined) {
      probabilityElement = (
        <tr>
          <td className="table-title">Probability</td>
          <td className="table-value">{ probability }</td>
        </tr>
      );
    }

    return (
      <TweenState id={ `frame-${id}` }>
        <div className={ `view` }>
          <div className={ `frame frame--${type}` }>
            <div className={ `frame__details` }>
              <TweenState id={ `image-${id}` }>
                <img className="details__image" src={ `img/${id}.png` } />
              </TweenState>
              <div className="details__details-container">
                <table className="details-table">
                  <tbody>
                    <tr>
                      <td className="table-title">Name</td>
                      <td className="table-value">{ name }</td>
                    </tr>
                    <tr>
                      <td className="table-title">Type</td>
                      <td className="table-value">{ capitalize(type) }</td>
                    </tr>
                    <tr>
                      <td className="table-title">Attack</td>
                      <td className="table-value">{ attack }</td>
                    </tr>
                    <tr>
                      <td className="table-title">Defense</td>
                      <td className="table-value">{ defense }</td>
                    </tr>
                    { levelsElement }
                    { evolveElement }
                    <tr>
                      <td className="table-title">Moves</td>
                      <td className="table-value">{ moves.map(capitalize).join(', ') }</td>
                    </tr>
                    { probabilityElement }
                    <tr>
                      <td className="table-title">Curve</td>
                      <td className="table-value">{ curve }</td>
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
