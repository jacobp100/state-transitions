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
				<Link key={ id } className={ `icon` } to={ 'view' } params={{ id }}>
					<TweenState id={ `frame-${id}` }>
						<div className={ `frame frame--${type}` }>
							<div className='frame__frame-body image-container'>
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
					<div>
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
					<td className='table-title'>Evolve Level</td>
					<td className='table-value'>{ evolveLevel }</td>
				</tr>,
				<tr>
					<td className='table-title'>Evolve To</td>
					<td className='table-value'>{ evolveTo }</td>
				</tr>
			];
		}

		if (levels !== undefined) {
			levelsElement = (
				<tr>
					<td className='table-title'>Levels</td>
					<td className='table-value'>{ levels.join(', ') }</td>
				</tr>
			);
		}

		if (probability !== undefined) {
			probabilityElement = (
				<tr>
					<td className='table-title'>Probability</td>
					<td className='table-value'>{ probability }</td>
				</tr>
			);
		}

		return (
			<TweenState id={ `frame-${id}` }>
				<div className={ `view` }>
					<div className={ `frame frame--${type}` }>
						<div className={ `frame__details` }>
							<TweenState id={ `image-${id}` }>
								<img className='details__image' src={ `img/${id}.png` } />
							</TweenState>
							<div className='details__details-container'>
								<table className='details-table'>
									<tr>
										<td className='table-title'>Name</td>
										<td className='table-value'>{ name }</td>
									</tr>
									<tr>
										<td className='table-title'>Type</td>
										<td className='table-value'>{ _.capitalize(type) }</td>
									</tr>
									<tr>
										<td className='table-title'>Attack</td>
										<td className='table-value'>{ attack }</td>
									</tr>
									<tr>
										<td className='table-title'>Defense</td>
										<td className='table-value'>{ defense }</td>
									</tr>
									{ levelsElement }
									{ evolveElement }
									<tr>
										<td className='table-title'>Moves</td>
										<td className='table-value'>{ moves.map(_.capitalize).join(', ') }</td>
									</tr>
									{ probabilityElement }
									<tr>
										<td className='table-title'>Curve</td>
										<td className='table-value'>{ curve }</td>
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
