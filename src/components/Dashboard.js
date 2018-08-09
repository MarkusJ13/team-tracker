import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import TrackTable from './TrackTable.js';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Modal from 'react-responsive-modal';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import './Dashboard.css';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

const Positions = ['Position 1', 'Position 2', 'Position 3', 'Position 4']

class Dashboard extends Component {
	constructor(props){
		super(props)
		this.state = {
			id: '',
			open: false,
			openUpdate: false,
			name: '',
			position: -1,
		}
	}

	showRoute = id => {
		this.props.changeScreen('route')
  	}

  	openModal = () => {
  		this.setState({open: true})
  	}

  	handleName = name => {
  		this.setState({name: name.target.value})
  	}

  	handlePosition = position => {
  		this.setState({position: position.target.value})
  	}

  	handleUpdated = updated => {
  		this.setState({updated: updated.target.value})
  	}

  	addTeam = () => {
  		let {name, position} = this.state
  		let updated = (new Date).toString()
  		let id = Math.random().toString(36).substring(7)
  		this.props.addTeam({id: id, name: name, position: position, updated: updated, showRoute: 'yes'})
  		this.setState({open: false})
  	}

  	updateTeam = id => {
  		let {teams} = this.props
  		let team = {}
  		for(let i=0; i< teams.length; i++){
  			if(teams[i].id === id){
  				team = teams[i]
  				break
  			}
  		}
  		this.setState({id: id, name: team.name, position: team.position, openUpdate: true, showRoute: team.showRoute})
  	}

  	saveUpdate = () => {
  		let {id, name, position} = this.state
  		let updated = (new Date).toString()
  		this.props.saveUpdate({id: id, name: name, position: position, updated: updated})
  		this.setState({openUpdate: false})
  	}

	render() {
		let {name, position, updated} = this.state
		console.log("ch", this.state.position)
		return (
			<div>
				<TrackTable
					showRoute={this.showRoute}
					teams={this.props.teams}
					updateTeam={this.updateTeam}
					deleteTeam={this.props.deleteTeam}
				/>
				<div style={{display: 'flex', justifyContent: 'center', margin: 20}}>
					<Button variant="contained" color="primary" onClick={this.openModal}>
						Add new team!
					</Button>
				</div>
				<Modal
					open={this.state.open}
					onClose={function(){this.setState({open: false})}.bind(this)}
					styles={{modal: {width: '800px'}, overlay: {alignItems: 'center'}}}
				>
					<div style={{marginRight: 30}} className="edit-header">Add new team</div>
					<TextField
						label="Team name"
						fullWidth={true}
						InputLabelProps={{shrink: true, className: "custom-label"}}
						margin="normal"
						value={name}
						InputProps={{className: "custom-text-field", disableUnderline: true}}
						onChange={this.handleName}
					/>
					<form autoComplete="off" style={{margin: 20}}>
						<FormControl >
							<InputLabel htmlFor="age-simple">Position</InputLabel>
							<Select
								value={this.state.position}
								onChange={this.handlePosition}
								inputProps={{
									name: 'Position',
									id: 'position-simple',
								}}
							>
							<MenuItem value={-1}><em>None</em></MenuItem>
							<MenuItem value={0}>Position 1</MenuItem>
							<MenuItem value={1}>Position 2</MenuItem>
							<MenuItem value={2}>Position 3</MenuItem>
							<MenuItem value={3}>Position 4</MenuItem>
							</Select>
						</FormControl>
					</form>
					<Button
						variant="contained"
						color="primary"
						classes={(name && this.state.position !== -1)?{
							root: 'custom-button-submit'
						}:{}}
						size="large"
						disabled={!(name && this.state.position !== -1)}
						onClick={this.addTeam}
					>
						Submit
					</Button>
				</Modal>
				<Modal
					open={this.state.openUpdate}
					onClose={function(){this.setState({openUpdate: false})}.bind(this)}
					styles={{modal: {width: '800px'}, overlay: {alignItems: 'center'}}}
				>
					<div style={{marginRight: 30}} className="edit-header">Update team</div>
					<TextField
						label="Team name"
						fullWidth={true}
						InputLabelProps={{shrink: true, className: "custom-label"}}
						margin="normal"
						value={name}
						InputProps={{className: "custom-text-field", disableUnderline: true}}
						onChange={this.handleName}
					/>
					<form autoComplete="off" style={{margin: 20}}>
						<FormControl >
							<InputLabel htmlFor="age-simple">Position</InputLabel>
							<Select
								value={this.state.position}
								onChange={this.handlePosition}
								inputProps={{
									name: 'Position',
									id: 'position-simple',
								}}
							>
								<MenuItem value={-1}><em>None</em></MenuItem>
								<MenuItem value={0}>Position 1</MenuItem>
								<MenuItem value={1}>Position 2</MenuItem>
								<MenuItem value={2}>Position 3</MenuItem>
								<MenuItem value={3}>Position 4</MenuItem>
							</Select>
						</FormControl>
					</form>
					<Button
						variant="contained"
						color="primary"
						classes={(name && this.state.position !== -1)?{
							root: 'custom-button-submit'
						}:{}}
						size="large"
						disabled={!(name && this.state.position !== -1)}
						onClick={this.saveUpdate}
					>
						Update
					</Button>
				</Modal>
			</div>
		);
	}
}

export default withStyles(styles)(Dashboard);
