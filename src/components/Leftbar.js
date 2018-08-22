import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import Edit from 'react-icons/lib/md/create';
import Dropdown from 'react-icons/lib/md/arrow-drop-down';
import Delete from 'react-icons/lib/md/delete';
import TextField from '@material-ui/core/TextField';

import './Dashboard.css';

class Leftbar extends Component {
	constructor(props){
		super(props)
		this.state = {
			editId: '',
			expand: this.props.teams.map(() => { return false })
		}
	}

	handleChange = id => event => {
		this.props.updateShowRoute(id, event.target.checked)
	};

	handleEdit = (id, index) => {
		let {editId, expand} = this.state
		expand[index] = !expand[index]
		if (editId === id){
			this.setState({editId: ''})

		}else{
			this.setState({editId: id})
		}
		this.setState({expand})
	}

	allowChange = (position) => {
		this.props.allowChange(position)
	}

	addNewPosition = teamId => {
		this.props.addNewPosition(teamId)
	}

	handleButton = id => {
		let {updating} = this.props
		if(updating){
			this.props.done()
			this.setState({editId: ''})

		}else{
			this.addNewPosition(id)
			this.setState({editId: id})
		}
	}

	getTeam = id => {
		let {teams} = this.props
		for(let i=0; i<teams.length; i++){
			if(teams[i].id === id) return i;
		}
		return null
	}

	deletePosition = (teamId, index) => {
		let {positions, teams} = this.props
		positions[teamId].splice(index, 1)
		let teamIndex = this.getTeam(teamId)
		if(teamIndex !== null && teams[teamIndex]){
			if(index <= teamIndex.position){
				let updated = (new Date).toString()
				this.props.saveTeamUpdate({id: teamId, name: teams[teamIndex].name, position: teams[teamIndex].position - 1, updated: updated})
			}
		}
		this.props.addPosition(positions)
	}

	changePositionName = (teamId, index, name) => {
		let {positions} = this.props
		positions[teamId][index].name = name
		this.props.addPosition(positions)
	}

	render() {
		let {editId, expand} = this.state
		let {positions, updating} = this.props
		console.log("check up", editId, this.props.teams)
		let checkBoxes = this.props.teams.map((team, index) => {
			let id = team.id
			return <div key={team.id} style={{borderBottom: '2px solid #e0e0e0'}}>
				<div style={{display: 'flex', alignItems: 'center'}}>
					<Checkbox checked={team.showRoute==='yes'} onChange={this.handleChange(team.id)} value={team.id} />
					<div style={{display: 'flex', flex: 1, cursor: 'pointer', padding: 5}} onClick={() => {this.handleEdit(id, index)}}>
						<div style={{flex: 1}}>{team.name}</div>
						<Dropdown size={18} />
					</div>
				</div>
				{expand[index]?<div>
					{positions[team.id]?positions[team.id].map((position, index) => {
						return <div style={{display: 'flex', alignItems: 'center', padding: '5px 20px'}}>
							<div style={{marginRight: 8}}>{index}</div>
							<TextField
								label="Position name"
								InputLabelProps={{shrink: true, className: "custom-label2"}}
								margin="normal"
								value={position.name}
								style={{margin: 0}}
								InputProps={{className: "custom-text-field2", disableUnderline: true}}
								onChange={text => {this.changePositionName(id, index, text.target.value)}}
							/>
							<div style={{marginLeft: 4}}>
							<Tooltip disableFocusListener title="Change position">
								<Button
									classes={{root: 'custom-button-round'}}
									onClick={this.allowChange.bind(this, {teamId: id, positionId: index})}
								>
								<Edit size={14} className="edit-icon"/>
								</Button>
							</Tooltip>
							<Delete
								size={14}
								className="delete-icon"
								style={{cursor: 'pointer', padding: 4}}
								onClick={this.deletePosition.bind(this, id, index)}
							/>
							</div>
						</div>
					}):null}
					<div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10}}>
					<Button onClick={this.handleButton.bind(this, id)} variant="contained" color="primary">
						{this.props.updating&&editId===id?"Done":"Add new position"}
					</Button>
					</div>
				</div>:null}
			</div>
		})

		return (
			<div style={{width: 256, borderRight: '2px solid #dadada', maxHeight: '100vh', overflowY: 'scroll'}}>
				<div>
					{checkBoxes}
				</div>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20}}>
				<Button onClick={this.props.changeScreen.bind(this, 'table')} variant="outlined" color="primary">
					GO BACK
				</Button>
				</div>
			</div>
		);
	}
}

export default Leftbar;
