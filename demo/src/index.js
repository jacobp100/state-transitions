'use strict';

const React = require('react');
const Router = require('react-router');
const _ = require('lodash');

const { TweenState, TransitionInOut } = require('../../src/index')(React);

const pokemon = require('../data/pokemon.json');

const { Route, DefaultRoute, RouteHandler, Link } = Router;


const List = React.createClass({
	getInitialState() {
		return {
			search: ''
		};
	},
	onChange(e) {
		this.setState({
			search: e.target.value
		});
	},
	render() {
		var { search } = this.state;

		var pokeItems = _(pokemon)
			.pick(({ name }) => (
				_.includes(name.toLowerCase(), search)
			)).mapValues(({ name, type }, id) => (
				<Link className={ `icon` } to={ 'view' } params={{ id }}>
					<TweenState key={ id } id={ `frame-${id}` }>
						<div className={ `frame frame--${type}` }>
							<div className='frame__body image-container'>
								<TweenState id={ `image-${id}` }>
									<img className='image-container__image' src={ `img/${id}.png` } />
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
			<TransitionInOut animateOutClassName='link-view--leaving'>
				<div className='link-view'>
					<input type='text' className='search' placeholder='Search&hellip;' onChange={ this.onChange } />
					<div className='link-view__items'>
						{ pokeItems }
					</div>
				</div>
			</TransitionInOut>
		);
	}
});

const View = React.createClass({
	render() {
		var { id } = this.props.params;

		var { name, type, attack, defense, levels, evolveLevel, evolveTo, moves, probability, curve } = pokemon[id];

		var levelsElement, evolveElement, probabilityElement;

		if (evolveLevel !== undefined && evolveTo !== undefined) {
			evolveElement = [
				<tr>
					<td className='details-table__title'>Evolve Level</td>
					<td className='details-table__value'>{ evolveLevel }</td>
				</tr>,
				<tr>
					<td className='details-table__title'>Evolve To</td>
					<td className='details-table__value'>{ evolveTo }</td>
				</tr>
			];
		}

		if (levels !== undefined) {
			levelsElement = (
				<tr>
					<td className='details-table__title'>Levels</td>
					<td className='details-table__value'>{ levels.join(', ') }</td>
				</tr>
			);
		}

		if (probability !== undefined) {
			probabilityElement = (
				<tr>
					<td className='details-table__title'>Probability</td>
					<td className='details-table__value'>{ probability }</td>
				</tr>
			);
		}

		return (
			<TweenState id={ `frame-${id}` }>
				<div className={ `view` }>
					<div className={ `view__frame frame--${type}` }>
						<div className={ `details` }>
							<TweenState id={ `image-${id}` }>
								<img className='details__image' src={ `img/${id}.png` } />
							</TweenState>
							<div className='details__details-container'>
								<table className='details-table'>
									<tr>
										<td className='details-table__title'>Name</td>
										<td className='details-table__value'>{ name }</td>
									</tr>
									<tr>
										<td className='details-table__title'>Type</td>
										<td className='details-table__value'>{ _.capitalize(type) }</td>
									</tr>
									<tr>
										<td className='details-table__title'>Attack</td>
										<td className='details-table__value'>{ attack }</td>
									</tr>
									<tr>
										<td className='details-table__title'>Defense</td>
										<td className='details-table__value'>{ defense }</td>
									</tr>
									{ levelsElement }
									{ evolveElement }
									<tr>
										<td className='details-table__title'>Moves</td>
										<td className='details-table__value'>{ moves.map(_.capitalize).join(', ') }</td>
									</tr>
									{ probabilityElement }
									<tr>
										<td className='details-table__title'>Curve</td>
										<td className='details-table__value'>{ curve }</td>
									</tr>
								</table>
							</div>
						</div>
						<TweenState id={ `label-${id}` }>
							<Link className={ `label label--huge label--${type}` } to='app'>
								Back
							</Link>
						</TweenState>
					</div>
				</div>
			</TweenState>
		);
	}
});

const App = React.createClass({
	render() {
		return <RouteHandler />;
	}
});

const routes = (
	<Route name='app' path='/' handler={ App }>
		<Route name='view' path='view/:id' handler={ View } />
		<DefaultRoute handler={ List } />
	</Route>
);

Router.run(routes, function (Handler) {
	React.render(<Handler/>, document.getElementById('MAIN'));
});
