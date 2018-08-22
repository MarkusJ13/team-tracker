import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Edit from 'react-icons/lib/md/create';
import Delete from 'react-icons/lib/md/delete';

import Modal from 'react-responsive-modal';

import './TrackTable.css';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

class TrackTable extends Component {
	constructor(props){
		super(props)
		this.state = {
			id: '',
			name: '',
			open: false
		}
	}

	deleteTeam = team => {
		this.setState({id: team.id, name: team.name, open: true})
	}

	confirmDelete = () => {
		this.props.deleteTeam(this.state.id)
		this.setState({open: false})
	}
	

  render() {
  const { classes, teams, positions } = this.props
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell>Team Name</CustomTableCell>
            <CustomTableCell>Current Position</CustomTableCell>
            <CustomTableCell>Tools</CustomTableCell>
            <CustomTableCell>Last Updated</CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map(n => {
            return (
              <TableRow className={classes.row} key={n.id}>
                <CustomTableCell component="th" scope="row">
                  <span style={{marginRight: 10, paddingRight: 10}}>
                    {n.name}
                  </span>
                  <Tooltip disableFocusListener title="Edit">
                    <Button
                    	classes={{root: 'custom-button-round'}}
                    	onClick={this.props.updateTeam.bind(this, n.id)}
                    >
                    	<Edit size={18} className="edit-icon"/>
                    </Button>
                  </Tooltip>
                </CustomTableCell>
                <CustomTableCell>
                  <span style={{marginRight: 10, paddingRight: 10}}>
                    {positions[n.id]&&(n.position!==undefined)?(positions[n.id][n.position]?positions[n.id][n.position].name:''):''}
                  </span>
                  <Tooltip disableFocusListener title="Edit">
                    <Button
                    	classes={{root: 'custom-button-round'}}
                    	onClick={this.props.updateTeamPosition.bind(this, n.id)}
                    >
                    	<Edit size={18} className="edit-icon"/>
                    </Button>
                  </Tooltip>
                </CustomTableCell>
                <CustomTableCell>
                  <Button
                  	variant="contained"
                  	color="primary"
                  	style={{marginRight: 20}}
                  	onClick={this.props.showRoute.bind(this, n.id)}
                  >
                    Route
                  </Button>
                  <Tooltip disableFocusListener title="Delete">
                    <Button classes={{root: 'custom-button-round'}} onClick={this.deleteTeam.bind(this, n)}>
                    	<Delete size={18} className="delete-icon"/>
                    </Button>
                  </Tooltip>
                </CustomTableCell>
                <CustomTableCell><div>{n.updated}</div></CustomTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Modal
		open={this.state.open}
		onClose={function(){this.setState({open: false})}.bind(this)}
		styles={{modal: {width: '800px'}, overlay: {alignItems: 'center'}}}
	  >
		<div style={{marginRight: 30}} className="edit-header">Delete team</div>
		<div style={{margin: '10px 0px', padding: 10}}>{`Do you want to delete this team (${this.state.name}) ?`}</div>
		<Button
			variant="contained"
			color="secondary"
			size="large"
			onClick={this.confirmDelete}
		>
			Delete
		</Button>
	  </Modal>
    </Paper>
  );
}
}

TrackTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TrackTable);