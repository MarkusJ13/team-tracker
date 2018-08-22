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
		let checkpoints = JSON.parse(localStorage.getItem('checkpoints'))
		this.state = {
			screen: 'table',
			teams: [],
			postions: {},
			checkpoints: checkpoints?checkpoints:[]
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
		positions[team.id] = []
		this.setState({teams, positions})
		localStorage.setItem('teams', JSON.stringify(teams))
		localStorage.setItem('positions', JSON.stringify(positions))
	}

	saveUpdate = update => {
		let {teams} = this.state
		for(let i=0; i<teams.length; i++){
			if(teams[i].id === update.id){
				teams[i].name = update.name
				teams[i].position = update.position
				teams[i].updated = update.updated
			}
		}
		this.setState({teams})
		localStorage.setItem('teams', JSON.stringify(teams))
	}

	getTeamId = id => {
		let {teams} = this.state
		for(let i=0; i<teams.length; i++){
			if(teams[i].id === id) return i
		}
	}

	saveRouteUpdate = (id, newPositions) => {
		let {teams, positions} = this.state
		teams[this.getTeamId(id)].position = newPositions[newPositions.length - 1]
		positions[id] = newPositions
		this.setState({teams, positions})
		console.log("final pos", positions)
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

	updateCheckpoints = checkpoints => {
		window.alert('Check points updated successfully!')
		this.setState({checkpoints})
	}

	addPosition = positions => {//change its name. update position
		this.setState({positions})
		localStorage.setItem('positions', JSON.stringify(positions))
	}

	render() {
		let {screen, teams, positions, checkpoints} = this.state
		return (
			<div>
				{screen==='table'?<Dashboard
					addTeam={this.addTeam}
					teams={teams}
					positions={positions}
					saveUpdate={this.saveUpdate}
					deleteTeam={this.deleteTeam}
					changeScreen={this.changeScreen}
					checkpoints={checkpoints}
					updateCheckpoints={this.updateCheckpoints}
					saveRouteUpdate={this.saveRouteUpdate}
				/>:
				<LiveRoute
					teams={teams}
					positions={positions}
					changeScreen={this.changeScreen}
					updateShowRoute={this.updateShowRoute}
					addPosition={this.addPosition}
					saveUpdate={this.saveUpdate}
				/>}
			</div>
		);
	}
}

export default App;
