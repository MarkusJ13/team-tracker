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
import UpdatePosition from './UpdatePosition.js';

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
			openUpdatePosition: false,
			name: '',
			position: -1,
		}
	}

	componentDidMount(){
		let self = this
		this.reader = new FileReader()
		this.reader.addEventListener("load", function (result) {
			self.parseCheckpoints(result.target.result)
		}, false);
	}

	parseCheckpoints = text => {
		let checkpoints = []
		let c = text.split('\n')
		for(let i=0; i<c.length; i++){
			if(c[i].split('|').length !== 6) continue
			let d = c[i].split('|')
			checkpoints.push({id: parseInt(d[1]), name: d[2], lat: parseFloat(d[3]), lng: parseFloat(d[4])})
		}
		localStorage.setItem('checkpoints', JSON.stringify(checkpoints))
		this.props.updateCheckpoints(checkpoints)
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
  		this.setState({id: id, name: team.name, openUpdate: true})
  	}

  	updateTeamPosition = id => {
  		let {teams} = this.props
  		let team = {}
  		for(let i=0; i< teams.length; i++){
  			if(teams[i].id === id){
  				team = teams[i]
  				break
  			}
  		}

  		this.setState({id: id, name: team.name, openUpdatePosition: true})
  	}

  	saveUpdate = () => {
  		let {id, name} = this.state
  		let updated = (new Date).toString()
  		this.props.saveUpdate({id: id, name: name, updated: updated})
  		this.setState({openUpdate: false})
  	}

  	handleCheckpoints = e => {
  		if(e.target.files && e.target.files[0]){
			this.reader.readAsText(e.target.files[0])
		}
  	}

	render() {
		let {id, name, position, updated} = this.state
		let {positions, checkpoints} = this.props
		return (
			<div>
				<TrackTable
					showRoute={this.showRoute}
					teams={this.props.teams}
					updateTeam={this.updateTeam}
					updateTeamPosition={this.updateTeamPosition}
					deleteTeam={this.props.deleteTeam}
				/>
				<div style={{display: 'flex', justifyContent: 'center', margin: 20}}>
					<Button variant="contained" color="primary" onClick={this.openModal}>
						Add new team!
					</Button>
					<label htmlFor="checkpoint-file">
						<Button
							variant="contained"
							color="secondary"
							component="span"
						>

							Upload checkpoints
						</Button>
					</label>
					<input
						type="file"
						id="checkpoint-file"
						style={{display: 'none'}}
						onClick={function(){this.fileInput.value = ""}.bind(this)}
						onChange={this.handleCheckpoints}
						ref={ref => this.fileInput = ref}
					/>
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
						<FormControl classes={{root: 'custom-form'}}>
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
							{checkpoints.map((checkpoint) => {
								return <MenuItem key={checkpoint.id} value={checkpoint.id}>{checkpoint.name}</MenuItem>
							})}
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
					<div style={{marginRight: 30}} className="edit-header">Update team name</div>
					<TextField
						label="Team name"
						fullWidth={true}
						InputLabelProps={{shrink: true, className: "custom-label"}}
						margin="normal"
						value={name}
						InputProps={{className: "custom-text-field", disableUnderline: true}}
						onChange={this.handleName}
					/>
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
				<Modal
					open={this.state.openUpdatePosition}
					onClose={function(){this.setState({openUpdatePosition: false})}.bind(this)}
					styles={{modal: {width: '800px'}, overlay: {alignItems: 'center'}}}
				>
					<UpdatePosition
						name={name}
						id={id}
						positions={positions[id]}
						checkpoints={checkpoints}
						saveUpdate={this.props.saveRouteUpdate}
						closeModal={() => {this.setState({openUpdatePosition: false})}}
					/>
				</Modal>
			</div>
		);
	}
}

export default withStyles(styles)(Dashboard);
