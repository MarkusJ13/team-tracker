import React, { Component } from 'react';
import { render } from 'react-dom';
import L from 'leaflet';
import 'leaflet-offline';
import './LiveRoute.css';
import localforage from 'localforage';
import Leftbar from './Leftbar.js';

const LatLngs = [[19.00, 72.85], [19.03, 72.93], [19.05, 72.85], [19.067, 72.82]]
const Colors = ['blue', 'red', 'green', 'blue', 'green', 'red']



class LiveRoute extends Component {
	constructor(props) {
		super(props)
		this.state = {
			changeTeam: '',
			changePosition: '',
			addPosition: false
		}

		let tilesDb = {
		    getItem: function (key) {
		        return localforage.getItem(key);
		    },

		    saveTiles: function (tileUrls) {
		        var self = this;

		        var promises = [];

		        for (var i = 0; i < tileUrls.length; i++) {
		            var tileUrl = tileUrls[i];

		            (function (i, tileUrl) {
		                promises[i] = new Promise(function (resolve, reject) {
						var request = new XMLHttpRequest();
						request.open('GET', tileUrl.url, true);
						request.responseType = 'blob';
						request.onreadystatechange = function () {
							if (request.readyState === XMLHttpRequest.DONE) {
								if (request.status === 200) {
									resolve(self._saveTile(tileUrl.key, request.response));
								} else {
									reject({
										status: request.status,
										statusText: request.statusText
									});
								}
							}
						};
						request.send();
		                });
		            })(i, tileUrl);
		        }

		        return Promise.all(promises);
		    },

		    clear: function () {
		        return localforage.clear();
		    },

			_saveTile: function (key, value) {
				return this._removeItem(key).then(function () {
					return localforage.setItem(key, value);
				});
			},

		    _removeItem: function (key) {
		        return localforage.removeItem(key);
		    }
		}
		this.tilesDb = tilesDb
		let offlineLayer = L.tileLayer.offline('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', tilesDb, {
		    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		    subdomains: 'abc',
		    minZoom: 12,
		    maxZoom: 19,
		    crossOrigin: true
		});
		let offlineControl = L.control.offline(offlineLayer, tilesDb, {
		    saveButtonHtml: '<i class="fa fa-download" aria-hidden="true"></i>',
		    removeButtonHtml: '<i class="fa fa-trash" aria-hidden="true"></i>',
		    confirmSavingCallback: function (nTilesToSave, continueSaveTiles) {
		        if (window.confirm('Save ' + nTilesToSave + '?')) {
		            continueSaveTiles();
		        }
		    },
		    confirmRemovalCallback: function (continueRemoveTiles) {
		        if (window.confirm('Remove all the tiles?')) {
		            continueRemoveTiles();
		        }
		    },
		    minZoom: 12,
		    maxZoom: 19
		});
		this.offlineLayer = offlineLayer
		this.offlineControl = offlineControl
	}

	componentDidMount(){
		let map = L.map('map-id');
		this.map = map

		this.offlineLayer.addTo(map);
		this.offlineControl.addTo(map);

		this.offlineLayer.on('offline:below-min-zoom-error', function () {
		    alert('Can not save tiles below minimum zoom level.');
		});

		this.offlineLayer.on('offline:save-start', function (data) {
		    console.log('Saving ' + data.nTilesToSave + ' tiles.');
		});

		this.offlineLayer.on('offline:save-end', function () {
		    alert('All the tiles were saved.');
		});

		this.offlineLayer.on('offline:save-error', function (err) {
		    console.error('Error when saving tiles: ' + err);
		});

		this.offlineLayer.on('offline:remove-start', function () {
		    console.log('Removing tiles.');
		});

		this.offlineLayer.on('offline:remove-end', function () {
		    alert('All the tiles were removed.');
		});

		this.offlineLayer.on('offline:remove-error', function (err) {
		    console.error('Error when removing tiles: ' + err);
		});

		this.map.setView({
			lat: 19.07,
			lng: 72.87
		}, 12);

		// create a red polyline from an array of LatLng points
		let latlngs = [
		    [19.00, 72.85],
		    [19.03, 72.93],
		    [19.05, 72.85]
		];

		let {teams, positions} = this.props
		for(let i=0; i<teams.length; i++){
			if(teams[i].showRoute === 'yes'){
				let positionIndex = teams[i].position!==undefined?teams[i].position:undefined
				if(positionIndex !== undefined){
					console.log("check index", positionIndex)
					let currPos = positions[teams[i].id][positionIndex]
					L.marker([currPos.lat, currPos.lng], {
						icon: new L.DivIcon({
							className: 'my-div-icon',
							html: '<img class="my-div-image" src="https://unpkg.com/leaflet@1.0.3/dist/images/marker-icon.png"/>' + '<span class="team-name-map">' + teams[i].name + '</span>'
						})
					}).addTo(this.map)
				}
				let latlngs = []
				let teamPositions = positions[teams[i].id]
				for(let j=0; j<teamPositions.length; j++){
					latlngs.push([teamPositions[j].lat, teamPositions[j].lng])
					L.marker([teamPositions[j].lat, teamPositions[j].lng], {
						icon: new L.DivIcon({
							className: 'team-position-icon',
							html: '<span class="team-postion-map">' + j.toString() + '</span>'
						})
					}).addTo(map)
				}
				L.polyline(latlngs, {color: Colors[i]}).addTo(map);	
			}
		}

		let self = this
		this.map.on('click', function(e){
			var coord = e.latlng;
			var lat = coord.lat;
			var lng = coord.lng;
			self.changePosition(lat, lng)
			console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
		});
	}

	clearMap = () => {
		for(let i in this.map._layers){
			if(this.map._layers[i]._path != undefined || this.map._layers[i]._icon != undefined) {
				try {
					this.map.removeLayer(this.map._layers[i]);
				}
				catch(e) {
					console.log("problem with " + e + this.map._layers[i]);
				}
			}
		}
	}

	updateMap = () => {
		this.clearMap()
		let {teams, positions} = this.props
		for(let i=0; i<teams.length; i++){
			if(teams[i].showRoute === 'yes'){
				let positionIndex = teams[i].position!==undefined?teams[i].position:undefined
				if(positionIndex !== undefined){
					let currPos = positions[teams[i].id][positionIndex]
						L.marker([currPos.lat, currPos.lng], {
							icon: new L.DivIcon({
								className: 'my-div-icon',
								html: '<img class="my-div-image" src="https://unpkg.com/leaflet@1.0.3/dist/images/marker-icon.png"/>' + '<span class="team-name-map">' + teams[i].name + '</span>'
							})
						}).addTo(this.map)
				}
				let latlngs = []
				let teamPositions = positions[teams[i].id]
				for(let j=0; j<teamPositions.length; j++){
					latlngs.push([teamPositions[j].lat, teamPositions[j].lng])
					L.marker([teamPositions[j].lat, teamPositions[j].lng], {
						icon: new L.DivIcon({
							className: 'team-position-icon',
							html: '<span class="team-postion-map">' + j.toString() + '</span>'
						})
					}).addTo(this.map)
				}
				L.polyline(latlngs, {color: Colors[i]}).addTo(this.map);	
			}
		}
	}

	componentWillReceiveProps(nextProps){
		this.updateMap()
	}

	allowChange = (position) => {
		this.setState({changeTeam: position.teamId, changePosition: position.positionId})
	}

	changePosition = (lat, lng) => {
		let {addPosition, changeTeam, changePosition} = this.state
		let {teams, positions} = this.props
		if(addPosition){
			positions[changeTeam].push({lat: lat, lng: lng, name: 'dummy name'})
			this.props.addPosition(positions)
		}else if(changeTeam && changePosition){
			// this.props.update
			positions[changeTeam][changePosition].lat = lat
			positions[changeTeam][changePosition].lng = lng
			this.props.addPosition(positions)
			console.log("chaning posington", changeTeam, changePosition, lat, lng)
		}
	}

	addNewPosition = teamId => {
		this.setState({changeTeam: teamId, addPosition: true})
	}

	done = () => {
		this.setState({addPosition: false, changeTeam: '', addPosition: ''})
	}

	render() {
		return (
		<div style={{display: 'flex'}}>
			<Leftbar
				changeScreen={this.props.changeScreen}
				teams={this.props.teams}
				updateShowRoute={this.props.updateShowRoute}
				positions={this.props.positions}
				allowChange={this.allowChange}
				addNewPosition={this.addNewPosition}
				updating={this.state.addPosition||this.state.changeTeam}
				done={this.done}
				addPosition={this.props.addPosition}
				saveTeamUpdate={this.props.saveUpdate}
			/>
			<div id="map-id" style={{width: 'calc(100vw - 256px)', height: '100vh'}}></div>
		</div>
		);
	}
}

export default LiveRoute;