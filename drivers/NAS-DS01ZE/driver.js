"use strict";

const path			= require('path');
const ZwaveDriver	= require('homey-zwavedriver');

module.exports = new ZwaveDriver( path.basename(__dirname), {
	debug: false,
	capabilities: {
		'alarm_contact': {
			'command_class': 'COMMAND_CLASS_SENSOR_BINARY',
			'command_get': 'SENSOR_BINARY_GET',
			'command_report': 'SENSOR_BINARY_REPORT',
			'command_report_parser': report => report['Sensor Value'] === 'detected an event'
		},
		'alarm_battery': { 
    			'command_class': 'COMMAND_CLASS_BATTERY',
	    		'command_get': 'BATTERY_GET',
    			'command_report': 'BATTERY_REPORT',
    			'command_report_parser': (report, node) => { 
    				if(report.hasOwnProperty('Battery Level (Raw)')) {
    					if (report['Battery Level (Raw)'][0] == 255) {
    						return true
    						}
    					return false
   	        			}
   					}		
    	},
		'measure_battery': { 
    			getOnWakeUp: true,
    			'command_class': 'COMMAND_CLASS_BATTERY',
	    		'command_get': 'BATTERY_GET',
    			'command_report': 'BATTERY_REPORT',
    			'command_report_parser': (report, node) => { 
    				if(report.hasOwnProperty('Battery Level (Raw)')) {
    					if(report['Battery Level (Raw)'][0] == 255) return 1;
        				return report['Battery Level (Raw)'][0];
						}
					return null;
    			}
    	}
	},
	settings: {
		"off_delay": {
			"index": 1,
			"size": 2,
			"parser": function( input ) {
				return new Buffer([ parseInt(input) ]);
			}
		},
		"basic_level_set": {
			"index": 2,
			"size": 1,
			"parser": function( input ) {
				return new Buffer([ parseInt(input) ]);
			}
		},
	}
});