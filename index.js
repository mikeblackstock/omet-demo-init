import osjs from 'osjs';
import {name as applicationName} from './metadata.json';
import {createBootWindow} from './src/boot-window.js';


const register = (core, args, options, metadata) => {

let userID= "demo";	

  const proc = core.make('osjs/application', {args, options, metadata});

  const sendMessage = (cmd, user, ...args) => proc.send(JSON.stringify({
  	cmd,
    user,
    args
  }));

const getCookie = (name) => {
	 let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

  createBootWindow(core, proc);
 
	
 
  sendMessage("init", "demo", "");
  
// messages from websocket 

  proc.on('ws:message', (...args) => {
 	if (args[0].length > 1) { // checks for blank line (a single CR, length 1) and ignores
 		console.log(...args);
	  	proc.emit('lilypond:compile:log', 'stderr', ...args);
	}  	

	if (args[0].search("rsync:") !== -1) {
		
		if (getCookie('ometID')) {
			console.log("COOKIE\n");
		
			console.log(getCookie('ometID'));
		}

	}

//init stuff
	if (args[0].search("init:") !== -1) {
		userID= args[0].split(":")[1];
		if (!getCookie('ometID')) 
			document.cookie="ometID=" + userID;
		proc.emit('setTmpID', userID);	
		sendMessage("rsync", userID, "");
		
	}	
	
  	
  });
  
  
 
 

 
 
  return proc;
};

osjs.register(applicationName, register);
