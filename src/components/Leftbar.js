import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import Checkbox from '@material-ui/core/Checkbox';

class Leftbar extends Component {
	handleChange = id => event => {
		this.props.updateShowRoute(id, event.target.checked)
	};

	render() {
		console.log("rt", this.props.teams)
		let checkBoxes = this.props.teams.map(team => {
			return <div style={{display: 'flex', alignItems: 'center'}} key={team.id}>
				<Checkbox checked={team.showRoute==='yes'} onChange={this.handleChange(team.id)} value={team.id} />
				<div>{team.name}</div>
			</div>
		})
		return (
			<div style={{width: 256}}>
				<button onClick={this.props.changeScreen.bind(this, 'table')}>
					GO BACK
				</button>
				<div>
					{checkBoxes}
				</div>
			</div>
		);
	}
}

export default Leftbar;
