import React, { Component } from 'react';
import { render } from 'react-dom';
import L from 'leaflet';
import 'leaflet-offline';

import localforage from 'localforage';
import Leftbar from './Leftbar.js';

const LatLngs = [[19.00, 72.85], [19.03, 72.93], [19.05, 72.85], [19.067, 72.82]]
const Colors = ['blue', 'red', 'green', 'blue', 'green', 'red']

class LiveRoute extends Component {
	constructor(props) {
		super(props)
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
		    maxZoom: 12,
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
				let currPos = LatLngs[teams[i].position]
				L.marker(currPos).addTo(map)
				let latlngs = []
				console.log("teams", teams[i].id, positions[teams[i].id])
				let teamPositions = positions[teams[i].id]
				console.log("pos", teamPositions)
				for(let j=0; j<teamPositions.length; j++){
					latlngs.push(LatLngs[teamPositions[j]])
				}
				L.polyline(latlngs, {color: Colors[i]}).addTo(map);	
			}
		}
		// zoom the map to the polyline
		// this.map.fitBounds(polyline.getBounds());
	}

	clearMap = () => {
		// console.log("he", L.markerClusterGroup())//.clearLayers();
		// this.map.eachLayer(layer => {
		// 	console.log("cl", layer)
		// 	this.map.removeLayer(layer);
		// });
		for(let i in this.map._layers){
			if(this.map._layers[i]._path != undefined || this.map._layers[i]._icon != undefined) {
				console.log("yeas")
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
				let currPos = LatLngs[teams[i].position]
				L.marker(currPos).addTo(this.map)
				let latlngs = []
				console.log("teams", teams[i].id, positions[teams[i].id])
				let teamPositions = positions[teams[i].id]
				console.log("pos", teamPositions)
				for(let j=0; j<teamPositions.length; j++){
					latlngs.push(LatLngs[teamPositions[j]])
				}
				L.polyline(latlngs, {color: Colors[i]}).addTo(this.map);	
			}
		}
	}

	componentWillReceiveProps(nextProps){
		console.log("np", nextProps)
		this.updateMap()
	}

	render() {
		return (
		<div style={{display: 'flex'}}>
			<Leftbar
				changeScreen={this.props.changeScreen}
				teams={this.props.teams}
				updateShowRoute={this.props.updateShowRoute}
			/>
			<div id="map-id" style={{width: 'calc(100vw - 256px)', height: '100vh'}}></div>
		</div>
		);
	}
}

export default LiveRoute;