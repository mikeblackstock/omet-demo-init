import osjs from 'osjs';
import {name as applicationName} from './metadata.json';
import {createInitWindow} from './src/init-window.js';


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


const notify= (msg) => {
core.make('osjs/notification', {
  message: msg,
//  icon: 'icon.src',
  onclick: () => console.log('Clicked!')
});	
};

 
	
 
  sendMessage("init", "demo", "");
  
// messages from websocket 

  proc.on('ws:message', (...args) => {
 	if (args[0].length > 1) { // checks for blank line (a single CR, length 1) and ignores
 		console.log(...args);
	  	proc.emit('lilypond:compile:log', 'stderr', ...args);
	}  	

	if (args[0].search("rsync:") !== -1) {
//		CB after folder cretion etc
		if (getCookie('ometID')) {
			console.log(getCookie('ometID'));
			
		}

		proc.emit('destroy');
	}

//init stuff
	if (args[0].search("init:") !== -1) {
		userID= args[0].split(":")[1];
//		if (!getCookie('ometID')) 
			document.cookie="ometID=" + userID;

		// create folder etc
		sendMessage("rsync", userID, "");
		
	}	
	
  	
  });
  
  
 
 

 
 
  return proc;
};

osjs.register(applicationName, register);
