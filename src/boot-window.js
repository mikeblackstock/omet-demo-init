/*eslint-disable no-extra-parens, no-sparse-arrays*/
import {
	h,
	app
} from 'hyperapp';
import {
	Box,
	BoxContainer,
	Button,
	Menubar,
	MenubarItem,
	Toolbar,
	Statusbar,
	TextareaField
} from '@osjs/gui';

let snippet = {};
let tmpID = '';
let zoomString = '#zoom=100';


const createEditorInterface = (core, proc, win, $content) => {
	let editor;
 
	const _ = core.make('osjs/locale').translate;
	const vfs = core.make('osjs/vfs');
	const contextmenu = core.make('osjs/contextmenu').show;
	const basic = core.make('osjs/basic-application', proc, win, {

		defaultFilename: ''
	});

	// const setText = contents => editor.setValue(contents); 





	const hyperapp = app({
		theme: 'ace/theme/chrome',
		mode: 'ace/mode/lilypond',
		row: 0,
		column: 0,
		lines: 0,
		buttons:'',
		showTools: false,
        selectionRange: "",
        beginSelect: {},
        endSelect: {},
		log: '',
		showLog: false
	}, {



	}, " Initialising...", $content);
/*
	proc.on('destroy', () => {
	    setTimeout(() => {
		win.destroy();
    	},1000);		

	});
*/
	proc.on('setTmpID', (userID) => {
		tmpID = userID;
		snippet = {
			filename: 'Default.ly',
			path: 'home:/' + tmpID + '/Default.ly'
		};


	});




	proc.on('attention', (args) => {
console.log(args.file.path);
		snippet = args.file;
		vfs.readfile(snippet)
			.then(contents => setText(contents, snippet.path))
			.catch(error => console.error(error)); // FIXME: Dialog
	});
	basic.on('new-file', () => {

	});

	basic.on('save-file', () => {
		//   if (proc.args.file) {
		const contents = getText();

		vfs.writefile(snippet, contents)
			//       .then(() => win.setTitle(proc.title))
			.then(() => setSavedTitle(snippet.path))
			.catch(error => console.error(error)); // FIXME: Dialog
		//   }
	});

	basic.on('open-file', (file) => {
		console.log(file);
		vfs.readfile(file)
			.then(contents => setText(contents, file.path))
			.catch(error => console.error(error)); // FIXME: Dialog
	});

	basic.init();

	win.on('resized', () => editor.resize());
	win.on('blur', () => editor.blur());
//	win.on('focus', () => editor.focus());

//	if (window.mobile === true) 
//			win.maximize();

	return hyperapp;
};

export const createBootWindow = (core, proc) =>
	proc.createWindow({
		id: 'BootWindow',
		title: proc.metadata.title.en_EN,
		icon: proc.resource(proc.metadata.icon),
		//a bit bigger
		dimension: {
			width: 200,
			height: 100
		},
		position: 'topright'
	})
	.on('destroy', () => proc.destroy())
	.render(($content, win) => {
		createEditorInterface(core, proc, win, $content);
  
	});
