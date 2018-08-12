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
			positions: [],
			changed: false,
		}
	}

	componentDidMount(){
		console.log("hey 2", this.props.positions)
		this.setState({
			positions: this.props.positions.slice(),
			changed: false
		})
	}

	componentWillUnmount(){
		this.setState({
			positions: [],
			changed: false
		})
		console.log("hey")
	}

	handlePosition = (position, index) => {
		let {positions} = this.state
		if(positions[index] !== position){
			this.setState({changed: true})
		}
		positions[index] = position
		this.setState({positions})
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
		let {positions} = this.state
		let {id} = this.props
		this.props.saveUpdate(id, positions)
		this.props.closeModal()
	}

	render() {
		let {name, checkpoints} = this.props
		let {positions, changed} = this.state
		console.log('positons', positions)
		let editablePositions = positions.map((position, index) => {
			return <div style={{margin: 20}} key={"p" + position + '-' + index}>
				<FormControl  classes={{root: 'custom-form'}}>
					<InputLabel>Position</InputLabel>
					<Select
						value={this.getCheckpointName(position)}
						onChange={position => {this.handlePosition(position.target.value, index)}}
						inputProps={{
							name: 'Position'
						}}
					>
					{checkpoints.map((checkpoint) => {
						return <MenuItem key={checkpoint.id} value={checkpoint.id}>{checkpoint.name}</MenuItem>
					})}
					</Select>
				</FormControl>
				<Button
					variant="contained"
					color="secondary"
					size="small"
					onClick={() => {this.deletePosition(index)}}
				>
					Delete
				</Button>
			</div>
		})

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
				<form autoComplete="off" style={{margin: 20}}>
					{editablePositions}
					<div style={{margin: 20}}>
						<FormControl classes={{root: 'custom-form'}}>
							<InputLabel>New Position</InputLabel>
							<Select
								value={-1}
								onChange={this.handleNewPosition}
								inputProps={{
									name: 'New Position'
								}}
							>
							<MenuItem value={-1}><em>None</em></MenuItem>
							{checkpoints.map((checkpoint) => {
								return <MenuItem key={checkpoint.id} value={checkpoint.id}>{checkpoint.name}</MenuItem>
							})}
							</Select>
						</FormControl>
					</div>
				</form>
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