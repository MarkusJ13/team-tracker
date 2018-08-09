import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from './components/Dashboard.js';
import LiveRoute from './components/LiveRoute.js';

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
}

class App extends Component {
	constructor(props){
		super(props)
		this.state = {
			screen: 'table',
			teams: [],
			postions: {}
		}
	}

	componentWillMount(){
		let teams = JSON.parse(localStorage.getItem('teams'))
		let positions = JSON.parse(localStorage.getItem('positions'))
		teams = teams?teams:[]//handle other error too
		positions = positions?positions:{}
		this.setState({teams, positions})
	}

	addTeam = team => {
		let {teams, positions} = this.state
		teams.push(team)
		positions[team.id] = [team.position]
		this.setState({teams, positions})
		localStorage.setItem('teams', JSON.stringify(teams))
		localStorage.setItem('positions', JSON.stringify(positions))
	}

	saveUpdate = update => {
		let {teams, positions} = this.state
		for(let i=0; i<teams.length; i++){
			if(teams[i].id === update.id){
				teams[i].name = update.name
				teams[i].position = update.position
				teams[i].updated = update.updated
				teams[i].showRoute = update.showRoute
			}
		}
		positions[update.id].push(update.position)
		this.setState({teams, positions})
		localStorage.setItem('teams', JSON.stringify(teams))
		localStorage.setItem('positions', JSON.stringify(positions))
	}

	deleteTeam = id => {
		let {teams, positions} = this.state
		for(let i=teams.length-1; i>=0; i--){
			if (teams[i].id === id) teams.splice(i, 1);
		}
		delete positions[id]
		this.setState({teams, positions})
		localStorage.setItem('teams', JSON.stringify(teams))
		localStorage.setItem('positions', JSON.stringify(positions))
	}

	changeScreen = screen => {
		this.setState({screen})
	}

	updateShowRoute = (id, status) => {
		let {teams} = this.state
		for(let i=0; i<teams.length; i++){
			if(teams[i].id === id){
				if(status) teams[i].showRoute = 'yes'
				else teams[i].showRoute = 'no'
			}
		}
		this.setState({teams})
		localStorage.setItem('teams', JSON.stringify(teams))
	}

	render() {
		let {screen, teams, positions} = this.state
		return (
			<div>
				{screen==='table'?<Dashboard
					addTeam={this.addTeam}
					teams={teams}
					saveUpdate={this.saveUpdate}
					deleteTeam={this.deleteTeam}
					changeScreen={this.changeScreen}

				/>:
				<LiveRoute
					teams={teams}
					positions={positions}
					changeScreen={this.changeScreen}
					updateShowRoute={this.updateShowRoute}
				/>}
			</div>
		);
	}
}

export default App;
