import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import './Dashboard.css';

class UpdatePosition extends Component {
	constructor(props){
		super(props)
		this.state = {
			position: this.props.teams[this.getTeam(this.props.id)].position,
			changed: false,
		}
	}

	getTeam = id => {
		let {teams} = this.props
		for(let i=0; i<teams.length; i++){
			if(teams[i].id === id) return i;
		}
		return null
	}

	handlePosition = position => {
		this.setState({changed: true, position: position.target.value})
	}

	deletePosition = i => {
		let {positions} = this.state
		positions.splice(i, 1)
		this.setState({positions})
		this.setState({changed: true})
	}

	handleNewPosition = position => {
		if(position.target.value !== -1){
			let {positions} = this.state
			positions.push(position.target.value)
			this.setState({positions, changed: true})
		}
	}

	getCheckpointName = id => {
		let {checkpoints} = this.props
		for(let i=0; i<checkpoints.length; i++){
			if(checkpoints[i].id === id) {
				return i
			}
		}
	}

	saveUpdate = () => {
		let {position} = this.state
		let {id, name} = this.props
		let updated = (new Date).toString()
		this.props.saveUpdate({id: id, name: name, position: position, updated: updated})
		this.props.closeModal()
	}

	render() {
		let {changed, position} = this.state
		console.log("check value", position)
		let {name, positions} = this.props
		return (
			<div>
				<div style={{marginRight: 30}} className="edit-header">Update team route</div>
				<TextField
					label="Team name"
					fullWidth={true}
					InputLabelProps={{shrink: true, className: "custom-label"}}
					margin="normal"
					value={name}
					InputProps={{className: "custom-text-field", disableUnderline: true}}
					disabled={true}
				/>
				{positions.length?<form autoComplete="off" style={{margin: 20}}>
					<FormControl  classes={{root: 'custom-form'}}>
						<InputLabel>Position</InputLabel>
						<Select
							value={position}
							onChange={this.handlePosition}
							inputProps={{
								name: 'Position'
							}}
						>
						{positions.map((position, index) => {
							return <MenuItem key={"position-" + index.toString() + "-" + position.name} value={index}>{position.name}</MenuItem>
						})}
						</Select>
					</FormControl>
				</form>:<div>Add new position (go to routes)</div>}
				<Button
					variant="contained"
					color="primary"
					classes={(changed)?{
						root: 'custom-button-submit'
					}:{}}
					size="large"
					disabled={!(changed)}
					onClick={this.saveUpdate}
				>
					Update
				</Button>
			</div>
		);
	}
}

export default UpdatePosition;