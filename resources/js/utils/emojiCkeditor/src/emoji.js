import { Plugin } from 'ckeditor5';
import { Typing } from 'ckeditor5';
import { createDropdown } from 'ckeditor5';
import { CKEditorError } from 'ckeditor5';
import EmojiCharactersNavigationView from './ui/emojicharactersnavigationview';
import CharacterGridView from './ui/charactergridview';
import CharacterInfoView from './ui/characterinfoview';


import '../theme/emoji-characters.css';

const ALL_EMOJI_CHARACTERS_GROUP = 'All';

export default class Emoji extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ Typing ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Emoji';
	}

	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );
		this._characters = new Map();
		this._groups = new Map();
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		const inputCommand = editor.commands.get( 'input' );

		editor.ui.componentFactory.add( 'emoji', locale => {
			const dropdownView = createDropdown( locale );
			let dropdownPanelContent;

			dropdownView.buttonView.set( {
				label: t( 'Emoji' ),
				icon: '<?xml version="1.0" encoding="iso-8859-1"?><!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g>	<g>		<path d="M437.02,74.98C388.667,26.629,324.38,0,256,0S123.333,26.629,74.98,74.98C26.629,123.333,0,187.62,0,256			s26.629,132.668,74.98,181.02C123.333,485.371,187.62,512,256,512s132.667-26.629,181.02-74.98			C485.371,388.668,512,324.38,512,256S485.371,123.333,437.02,74.98z M256,472c-119.103,0-216-96.897-216-216S136.897,40,256,40			s216,96.897,216,216S375.103,472,256,472z"/>	</g></g><g>	<g>		<path d="M368.993,285.776c-0.072,0.214-7.298,21.626-25.02,42.393C321.419,354.599,292.628,368,258.4,368			c-34.475,0-64.195-13.561-88.333-40.303c-18.92-20.962-27.272-42.54-27.33-42.691l-37.475,13.99			c0.42,1.122,10.533,27.792,34.013,54.273C171.022,389.074,212.215,408,258.4,408c46.412,0,86.904-19.076,117.099-55.166			c22.318-26.675,31.165-53.55,31.531-54.681L368.993,285.776z"/>	</g></g><g>	<g>		<circle cx="168" cy="180.12" r="32"/>	</g></g><g>	<g>		<circle cx="344" cy="180.12" r="32"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>',
				tooltip: true,
			} );

			dropdownView.bind( 'isEnabled' ).to( inputCommand );

			// Insert a special character when a tile was clicked.
			dropdownView.on( 'execute', ( evt, data ) => {
				editor.execute( 'input', { text: data.character } );
				editor.editing.view.focus();
			} );

			dropdownView.on( 'change:isOpen', () => {
				if ( !dropdownPanelContent ) {
					dropdownPanelContent = this._createDropdownPanelContent( locale, dropdownView );

					dropdownView.panelView.children.add( dropdownPanelContent.navigationView );
					dropdownView.panelView.children.add( dropdownPanelContent.gridView );
					dropdownView.panelView.children.add( dropdownPanelContent.infoView );
				}

				dropdownPanelContent.infoView.set( {
					character: null,
					name: null
				} );
			} );

			return dropdownView;
		} );
	}

	addItems( groupName, items ) {
		if ( groupName === ALL_EMOJI_CHARACTERS_GROUP ) {
			throw new CKEditorError(
				`emoji-group-error-name: The name "${ ALL_EMOJI_CHARACTERS_GROUP }" is reserved and cannot be used.`
			);
		}

		const group = this._getGroup( groupName );

		for ( const item of items ) {
			group.add( item.title );
			this._characters.set( item.title, item.character );
		}
	}

	getGroups() {
		return this._groups.keys();
	}

	getCharactersForGroup( groupName ) {
		if ( groupName === ALL_EMOJI_CHARACTERS_GROUP ) {
			return new Set( this._characters.keys() );
		}

		return this._groups.get( groupName );
	}

	getCharacter( title ) {
		return this._characters.get( title );
	}

	_getGroup( groupName ) {
		if ( !this._groups.has( groupName ) ) {
			this._groups.set( groupName, new Set() );
		}

		return this._groups.get( groupName );
	}

	_updateGrid( currentGroupName, gridView ) {
			gridView.tiles.clear();
				const characterTitles = this.getCharactersForGroup( currentGroupName );
				for ( const title of characterTitles ) {
					setTimeout(()=>{
					const character = this.getCharacter( title );
					gridView.tiles.add( gridView.createTile( character, title ) );
				},0);
				}
	}
	_createDropdownPanelContent( locale, dropdownView ) {
		const specialCharsGroups = [ ...this.getGroups() ];

		// Add a special group that shows all available special characters.
		specialCharsGroups.unshift( ALL_EMOJI_CHARACTERS_GROUP );

		const navigationView = new EmojiCharactersNavigationView( locale, specialCharsGroups );
		const gridView = new CharacterGridView( locale );
		const infoView = new CharacterInfoView( locale );

		gridView.delegate( 'execute' ).to( dropdownView );

		gridView.on( 'tileHover', ( evt, data ) => {
			infoView.set( data );
		} );

		// Update the grid of special characters when a user changed the character group.
		navigationView.on( 'execute', () => {
			this._updateGrid( navigationView.currentGroupName, gridView );
		} );
		// Set the initial content of the special characters grid.
		this._updateGrid( navigationView.currentGroupName, gridView )
		return { navigationView, gridView, infoView };
	}
}

