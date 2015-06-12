'use strict';

const React = require('react');
const Router = require('react-router');
const _ = require('lodash');

const { TweenState, TransitionInOut } = require('../../index')(React);

const pokemon = require('../data/pokemon.json');

const { Route, DefaultRoute, RouteHandler, Link } = Router;


const List = React.createClass({
	mixins: [TweenState, TransitionInOut],
	animateOutClassName: 'link-view--leaving',
	transitionEndTime: -1,
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
				<Link key={ id } className={ `icon` } to={ 'view' } params={{ id }}>
					<div ref={ `poke-${id}-frame` } className={ `frame frame--${type}` }>
						<div className='frame__body image-container'>
							<img ref={ `poke-${id}-image` } className='image-container__image' src={ `img/${id}.png` } />
						</div>
						<span ref={ `poke-${id}-label` } className={ `label label--${type}` }>
							{ name }
						</span>
					</div>
				</Link>
			))
			.values()
			.value();

		return (
			<div className='link-view'>
				<input type='text' className='search' placeholder='Search&hellip;' onChange={ this.onChange } />
				<div className='link-view__items'>
					{ pokeItems }
				</div>
			</div>
		);
	}
});

const View = React.createClass({
	mixins: [TweenState],
	transitionEndTime: -1,
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
			<div ref={ `poke-${id}-frame` } className={ `view` }>
				<div className={ `view__frame frame--${type}` }>
					<div className={ `details` }>
						<img ref={ `poke-${id}-image` } className='details__image' src={ `img/${id}.png` } />
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
					<Link ref={ `poke-${id}-label` } className={ `label label--huge label--${type}` } to='app'>
						Back
					</Link>
				</div>
			</div>
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
