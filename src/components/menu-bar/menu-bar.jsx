import classNames from 'classnames';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import throttle from 'lodash.throttle';
import bowser from 'bowser';
import React from 'react';

import VM from 'scratch-vm';

import Box from '../box/box.jsx';
import CommunityButton from './community-button.jsx';
import ShareButton from './share-button.jsx';
import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import Divider from '../divider/divider.jsx';
import ProjectWatcher from '../../containers/project-watcher.jsx';
import ProjectTitleInput from './project-title-input.jsx';
import AuthorInfo from './author-info.jsx';
import SB3Downloader from '../../containers/sb3-downloader.jsx';
import DeletionRestorer from '../../containers/deletion-restorer.jsx';
import TurboMode from '../../containers/turbo-mode.jsx';
import MenuBarHOC from '../../containers/menu-bar-hoc.jsx';
import SettingsMenu from './settings-menu.jsx';

import FramerateChanger from '../../containers/tw-framerate-changer.jsx';
import ChangeUsername from '../../containers/tw-change-username.jsx';
import CloudVariablesToggler from '../../containers/tw-cloud-toggler.jsx';
import TWSaveStatus from './tw-save-status.jsx';

import {openTipsLibrary, openSettingsModal, openRestorePointModal, openFeedbackModal} from '../../reducers/modals';
import {setPlayer} from '../../reducers/mode';
import {
    isTimeTravel220022BC,
    isTimeTravel1920,
    isTimeTravel1990,
    isTimeTravel2020,
    isTimeTravelNow,
    setTimeTravel
} from '../../reducers/time-travel';
import {
    autoUpdateProject,
    getIsUpdating,
    getIsShowingProject,
    manualUpdateProject,
    requestNewProject,
    remixProject,
    saveProjectAsCopy
} from '../../reducers/project-state';
import {
    openAboutMenu,
    closeAboutMenu,
    aboutMenuOpen,
    openFileMenu,
    closeFileMenu,
    fileMenuOpen,
    openEditMenu,
    closeEditMenu,
    editMenuOpen,
    openModeMenu,
    closeModeMenu,
    modeMenuOpen,
    settingsMenuOpen,
    openSettingsMenu,
    closeSettingsMenu,
    errorsMenuOpen,
    openErrorsMenu,
    closeErrorsMenu
} from '../../reducers/menus';
import {setFileHandle} from '../../reducers/tw.js';

import collectMetadata from '../../lib/collect-metadata';

import styles from './menu-bar.css';

import ninetiesLogo from './nineties_logo.svg';
import catLogo from './cat_logo.svg';
import prehistoricLogo from './prehistoric-logo.svg';
import oldtimeyLogo from './oldtimey-logo.svg';

import sharedMessages from '../../lib/shared-messages';

import SeeInsideButton from './tw-see-inside.jsx';
import {notScratchDesktop} from '../../lib/isScratchDesktop.js';
import {APP_NAME} from '../../lib/brand.js';

import {
    MduiButton,
    MduiDivider,
    MduiDropdown,
    MduiIcon,
    MduiIconButton,
    MduiMenu,
    MduiMenuItem
} from '../../lib/mdui';


const twMessages = defineMessages({
    compileError: {
        id: 'tw.menuBar.compileError',
        defaultMessage: '{sprite}: {error}',
        description: 'Error message in error menu'
    },
    about: {
        id: 'tw.menuBar.about',
        defaultMessage: 'About',
        description: 'Accessible label for the about button in the menu bar'
    },
    help: {
        id: 'tw.menuBar.help',
        defaultMessage: 'Help',
        description: 'Accessible label for the help (about menu) button in the menu bar'
    },
    compilerWarnings: {
        id: 'tw.menuBar.compilerWarnings',
        defaultMessage: 'Compiler warnings',
        description: 'Accessible label for the compiler warnings button in the menu bar'
    }
});

const MenuBarItemTooltip = ({
    children,
    className,
    enable,
    place = 'bottom'
}) => {
    if (enable) {
        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        );
    }
    return (
        <ComingSoonTooltip
            className={classNames(styles.comingSoon, className)}
            place={place}
            tooltipClassName={styles.comingSoonTooltip}
        >
            {children}
        </ComingSoonTooltip>
    );
};


MenuBarItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    enable: PropTypes.bool,
    place: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

const AboutButton = props => (
    <MduiIconButton
        icon="help"
        aria-label={props.ariaLabel}
        onClick={props.onClick}
    />
);

AboutButton.propTypes = {
    ariaLabel: PropTypes.string,
    onClick: PropTypes.func.isRequired
};

// Unlike <MenuItem href="">, this uses an actual <a> (rendered by mdui-menu-item's href support)
const MenuItemLink = props => (
    <MduiMenuItem
        href={props.href}
        rel="noreferrer"
        target="_blank"
        onClick={props.onClick}
    >
        {props.children}
    </MduiMenuItem>
);

MenuItemLink.propTypes = {
    children: PropTypes.node.isRequired,
    href: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

class MenuBar extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClickSeeInside',
            'handleClickNew',
            'handleClickNewWindow',
            'handleClickRemix',
            'handleClickSave',
            'handleClickSaveAsCopy',
            'handleClickPackager',
            'handleClickDesktopSettings',
            'handleClickRestorePoints',
            'handleClickSeeCommunity',
            'handleClickShare',
            'handleSetMode',
            'handleKeyPress',
            'handleRestoreOption',
            'getSaveToComputerHandler',
            'restoreOptionMessage',
            'handleErrorsLinkClick',
            'updateAlignment',
            'handleResize',
            'handleFileMenuOpened',
            'handleFileMenuClosed',
            'handleEditMenuOpened',
            'handleEditMenuClosed',
            'handleModeMenuOpened',
            'handleModeMenuClosed',
            'handleErrorsMenuOpened',
            'handleErrorsMenuClosed',
            'handleAboutMenuOpened',
            'handleAboutMenuClosed',
            'setErrorsDropdownRef',
            'setAboutDropdownRef'
        ]);
        this.menuBarInnerRef = React.createRef();
        this.fileDropdownRef = React.createRef();
        this.editDropdownRef = React.createRef();
        this.modeDropdownRef = React.createRef();
        this.errorsDropdownRef = null;
        this.aboutDropdownRef = null;
    }
    componentDidMount () {
        document.addEventListener('keydown', this.handleKeyPress);
        // The alignment uses a pixel-based translateX, so recompute it when
        // the viewport changes size. Throttled because updateAlignment
        // forces layout reads and writes.
        window.addEventListener('resize', this.handleThrottledResize);
        this.updateAlignment(this.props.menuBarAlignment, false);
    }
    componentDidUpdate (prevProps) {
        if (prevProps.menuBarAlignment !== this.props.menuBarAlignment) {
            this.updateAlignment(this.props.menuBarAlignment, true);
        }
        this.syncMenuDropdowns(prevProps);
    }
    componentWillUnmount () {
        document.removeEventListener('keydown', this.handleKeyPress);
        window.removeEventListener('resize', this.handleThrottledResize);
        this.handleThrottledResize.cancel();
    }
    // Defined as an instance property so componentDidMount and
    // componentWillUnmount subscribe and unsubscribe the same instance.
    handleThrottledResize = throttle(() => this.handleResize(), 200);
    // Push Redux open state changes into the mdui-dropdown elements
    // (the dropdowns manage their own visual state, so this only fires on
    // programmatic changes such as sibling menu collapsing). The opened/closed
    // events are bound declaratively via the MduiDropdown wrapper's
    // onOpened/onClosed props, so no manual addEventListener glue is needed.
    syncMenuDropdowns (prevProps) {
        const sync = (ref, wasOpen, isOpen) => {
            const element = ref && ref.current;
            if (element && wasOpen !== isOpen) element.open = isOpen;
        };
        sync(this.fileDropdownRef, prevProps.fileMenuOpen, this.props.fileMenuOpen);
        sync(this.editDropdownRef, prevProps.editMenuOpen, this.props.editMenuOpen);
        sync(this.modeDropdownRef, prevProps.modeMenuOpen, this.props.modeMenuOpen);
        if (this.errorsDropdownRef && prevProps.errorsMenuOpen !== this.props.errorsMenuOpen) {
            this.errorsDropdownRef.open = this.props.errorsMenuOpen;
        }
        if (this.aboutDropdownRef && prevProps.aboutMenuOpen !== this.props.aboutMenuOpen) {
            this.aboutDropdownRef.open = this.props.aboutMenuOpen;
        }
    }
    handleFileMenuOpened () {
        if (!this.props.fileMenuOpen) this.props.onClickFile();
    }
    handleFileMenuClosed () {
        if (this.props.fileMenuOpen) this.props.onRequestCloseFile();
    }
    handleEditMenuOpened () {
        if (!this.props.editMenuOpen) this.props.onClickEdit();
    }
    handleEditMenuClosed () {
        if (this.props.editMenuOpen) this.props.onRequestCloseEdit();
    }
    handleModeMenuOpened () {
        if (!this.props.modeMenuOpen) this.props.onClickMode();
    }
    handleModeMenuClosed () {
        if (this.props.modeMenuOpen) this.props.onRequestCloseMode();
    }
    handleErrorsMenuOpened () {
        if (!this.props.errorsMenuOpen) this.props.onClickErrors();
    }
    handleErrorsMenuClosed () {
        if (this.props.errorsMenuOpen) this.props.onRequestCloseErrors();
    }
    handleAboutMenuOpened () {
        if (!this.props.aboutMenuOpen) this.props.onRequestOpenAbout();
    }
    handleAboutMenuClosed () {
        if (this.props.aboutMenuOpen) this.props.onRequestCloseAbout();
    }
    setErrorsDropdownRef (element) {
        this.errorsDropdownRef = element;
    }
    setAboutDropdownRef (element) {
        this.aboutDropdownRef = element;
    }
    updateAlignment (alignment, animate) {
        const inner = this.menuBarInnerRef.current;
        if (!inner) return;
        const vw = window.innerWidth;

        // Temporarily remove flex-grow and explicit width to get natural width
        inner.style.flexGrow = '0';
        inner.style.removeProperty('width');

        // Force layout to read natural width
        const naturalWidth = inner.offsetWidth;

        // For left alignment, the wrapper should fill the parent width
        if (alignment === 'left') {
            inner.style.flexGrow = '1';
            inner.style.width = '100%';
        }

        // Calculate pixel-based translateX (independent of element width)
        let translateX;
        switch (alignment) {
        case 'center':
            translateX = Math.round((vw - naturalWidth) / 2);
            break;
        case 'right':
            translateX = Math.round(vw - naturalWidth);
            break;
        default:
            translateX = 0;
        }

        if (animate) {
            inner.style.transition = 'transform 0.25s cubic-bezier(0.42, 0, 0.58, 1)';
            // Force layout so the transition captures the old transform
            // eslint-disable-next-line no-unused-expressions
            inner.offsetHeight;
            inner.style.transform = `translateX(${translateX}px)`;
            inner.addEventListener('transitionend', function cleanup () {
                inner.style.transition = '';
                inner.removeEventListener('transitionend', cleanup);
            });
        } else {
            inner.style.transition = 'none';
            inner.style.transform = `translateX(${translateX}px)`;
            // eslint-disable-next-line no-unused-expressions
            inner.offsetHeight;
            inner.style.transition = '';
        }
    }
    // Recompute the menu bar alignment for the current viewport width.
    handleResize () {
        this.updateAlignment(this.props.menuBarAlignment, false);
    }
    handleClickNew () {
        // if the project is dirty, and user owns the project, we will autosave.
        // but if they are not logged in and can't save, user should consider
        // downloading or logging in first.
        // Note that if user is logged in and editing someone else's project,
        // they'll lose their work.
        const readyToReplaceProject = this.props.confirmReadyToReplaceProject(
            this.props.intl.formatMessage(sharedMessages.replaceProjectWarning)
        );
        if (readyToReplaceProject) {
            this.props.onClickNew(this.props.canSave && this.props.canCreateNew);
        }
        this.props.onRequestCloseFile();
    }
    handleClickNewWindow () {
        this.props.onClickNewWindow();
        this.props.onRequestCloseFile();
    }
    handleClickRemix () {
        this.props.onClickRemix();
        this.props.onRequestCloseFile();
    }
    handleClickSave () {
        this.props.onClickSave();
        this.props.onRequestCloseFile();
    }
    handleClickSaveAsCopy () {
        this.props.onClickSaveAsCopy();
        this.props.onRequestCloseFile();
    }
    handleClickPackager () {
        this.props.onClickPackager();
        this.props.onRequestCloseFile();
    }
    handleClickDesktopSettings () {
        this.props.onClickDesktopSettings();
        this.props.onRequestCloseSettings();
    }
    handleClickRestorePoints () {
        this.props.onClickRestorePoints();
        this.props.onRequestCloseFile();
    }
    handleClickSeeCommunity (waitForUpdate) {
        if (this.props.shouldSaveBeforeTransition()) {
            this.props.autoUpdateProject(); // save before transitioning to project page
            waitForUpdate(true); // queue the transition to project page
        } else {
            waitForUpdate(false); // immediately transition to project page
        }
    }
    handleClickShare (waitForUpdate) {
        if (!this.props.isShared) {
            if (this.props.canShare) { // save before transitioning to project page
                this.props.onShare();
            }
            if (this.props.canSave) { // save before transitioning to project page
                this.props.autoUpdateProject();
                waitForUpdate(true); // queue the transition to project page
            } else {
                waitForUpdate(false); // immediately transition to project page
            }
        }
    }
    handleSetMode (mode) {
        return () => {
            // Turn on/off filters for modes.
            // FIXME: filter on documentElement breaks position:fixed descendants
            if (mode === '1920') {
                document.documentElement.style.filter = 'brightness(.9)contrast(.8)sepia(1.0)';
                document.documentElement.style.height = '100%';
            } else if (mode === '1990') {
                document.documentElement.style.filter = 'hue-rotate(40deg)';
                document.documentElement.style.height = '100%';
            } else {
                document.documentElement.style.filter = '';
                document.documentElement.style.height = '';
            }

            // Change logo for modes
            if (mode === '1990') {
                document.getElementById('logo_img').src = ninetiesLogo;
            } else if (mode === '2020') {
                document.getElementById('logo_img').src = catLogo;
            } else if (mode === '1920') {
                document.getElementById('logo_img').src = oldtimeyLogo;
            } else if (mode === '220022BC') {
                document.getElementById('logo_img').src = prehistoricLogo;
            } else {
                document.getElementById('logo_img').src = this.props.logo;
            }

            this.props.onSetTimeTravelMode(mode);
        };
    }
    handleRestoreOption (restoreFun) {
        return () => {
            restoreFun();
            this.props.onRequestCloseEdit();
        };
    }
    handleErrorsLinkClick () {
        this.props.onRequestCloseErrors();
    }
    handleKeyPress (event) {
        const modifier = bowser.mac ? event.metaKey : event.ctrlKey;
        if (modifier) {
            if (event.key.toLowerCase() === 's') {
                this.props.handleSaveProject();
                event.preventDefault();
            } else if (event.key.toLowerCase() === 'o') {
                event.preventDefault();
                this.props.onStartSelectingFileUpload();
            }
        }
    }
    getSaveToComputerHandler (downloadProjectCallback) {
        return () => {
            this.props.onRequestCloseFile();
            downloadProjectCallback();
            if (this.props.onProjectTelemetryEvent) {
                const metadata = collectMetadata(this.props.vm, this.props.projectTitle, this.props.locale);
                this.props.onProjectTelemetryEvent('projectDidSave', metadata);
            }
        };
    }
    restoreOptionMessage (deletedItem) {
        switch (deletedItem) {
        case 'Sprite':
            return (<FormattedMessage
                defaultMessage="恢复角色"
                description="Menu bar item for restoring the last deleted sprite."
                id="gui.menuBar.restoreSprite"
            />);
        case 'Sound':
            return (<FormattedMessage
                defaultMessage="恢复声音"
                description="Menu bar item for restoring the last deleted sound."
                id="gui.menuBar.restoreSound"
            />);
        case 'Costume':
            return (<FormattedMessage
                defaultMessage="恢复造型"
                description="Menu bar item for restoring the last deleted costume."
                id="gui.menuBar.restoreCostume"
            />);
        default: {
            return (<FormattedMessage
                defaultMessage="恢复"
                description="Menu bar item for restoring the last deleted item in its disabled state." /* eslint-disable-line max-len */
                id="gui.menuBar.restore"
            />);
        }
        }
    }
    handleClickSeeInside () {
        this.props.onClickSeeInside();
    }
    buildAboutMenu (onClickAbout) {
        if (!onClickAbout) {
            // hide the button
            return null;
        }
        if (typeof onClickAbout === 'function') {
            // make a button which calls a function
            return (
                <AboutButton
                    onClick={onClickAbout}
                    ariaLabel={this.props.intl.formatMessage(twMessages.about)}
                />
            );
        }
        // assume it's an array of objects
        // each item must have a 'title' FormattedMessage and a 'handleClick' function
        // generate a menu with items for each object in the array
        return (
            <MduiDropdown
                ref={this.setAboutDropdownRef}
                placement={this.props.isRtl ? 'bottom-start' : 'bottom-end'}
                onOpened={this.handleAboutMenuOpened}
                onClosed={this.handleAboutMenuClosed}
            >
                <MduiIconButton
                    slot="trigger"
                    icon="help"
                    aria-label={this.props.intl.formatMessage(twMessages.help)}
                />
                <MduiMenu>
                    {
                        onClickAbout.map(itemProps => (
                            <MduiMenuItem
                                key={itemProps.title}
                                onClick={this.wrapAboutMenuCallback(itemProps.onClick)}
                            >
                                {itemProps.title}
                            </MduiMenuItem>
                        ))
                    }
                </MduiMenu>
            </MduiDropdown>
        );
    }
    wrapAboutMenuCallback (callback) {
        return () => {
            callback();
            this.props.onRequestCloseAbout();
        };
    }
    render () {
        const saveNowMessage = (
            <FormattedMessage
                defaultMessage="保存"
                description="Menu bar item for saving now"
                id="gui.menuBar.saveNow"
            />
        );
        const createCopyMessage = (
            <FormattedMessage
                defaultMessage="另存为"
                description="Menu bar item for saving as a copy"
                id="gui.menuBar.saveAsCopy"
            />
        );
        const remixMessage = (
            <FormattedMessage
                defaultMessage="改编"
                description="Menu bar item for remixing"
                id="gui.menuBar.remix"
            />
        );
        const newProjectMessage = (
            <FormattedMessage
                defaultMessage="新建"
                description="Menu bar item for creating a new project"
                id="gui.menuBar.new"
            />
        );
        const remixButton = (
            <MduiButton
                variant="filled"
                icon="sync"
                className={classNames(
                    styles.menuBarButton,
                    styles.remixButton
                )}
                onClick={this.handleClickRemix}
            >
                {remixMessage}
            </MduiButton>
        );
        // Show the About button only if we have a handler for it (like in the desktop app)
        const aboutButton = this.buildAboutMenu(this.props.onClickAbout);

        const menuBar = (
            <Box
                className={classNames(
                    this.props.className,
                    styles.menuBar
                )}
            >
                <div
                    ref={this.menuBarInnerRef}
                    className={styles.menuBarInner}
                >
                    <div className={styles.mainMenu}>
                        <div className={styles.fileGroup}>
                            {this.props.errors.length > 0 && <div>
                                <MduiDropdown
                                    ref={this.setErrorsDropdownRef}
                                    placement={this.props.isRtl ? 'bottom-end' : 'bottom-start'}
                                    onOpened={this.handleErrorsMenuOpened}
                                    onClosed={this.handleErrorsMenuClosed}
                                >
                                    <MduiIconButton
                                        slot="trigger"
                                        icon="warning"
                                        aria-label={this.props.intl.formatMessage(twMessages.compilerWarnings)}
                                    />
                                    <MduiMenu>
                                        <MenuItemLink
                                            href="https://scratch.mit.edu/users/GarboMuffin/#comments"
                                            onClick={this.handleErrorsLinkClick}
                                        >
                                            <FormattedMessage
                                                defaultMessage="部分脚本出错了"
                                                description="Link in error menu"
                                                id="tw.menuBar.reportError1"
                                            />
                                        </MenuItemLink>
                                        <MenuItemLink
                                            href="https://scratch.mit.edu/users/GarboMuffin/#comments"
                                            onClick={this.handleErrorsLinkClick}
                                        >
                                            <FormattedMessage
                                                defaultMessage="请报告此问题"
                                                description="Link in error menu"
                                                id="tw.menuBar.reportError2"
                                            />
                                        </MenuItemLink>
                                        <MduiDivider />
                                        {this.props.errors.map(({id, sprite, error}) => (
                                            <MduiMenuItem key={id}>
                                                {this.props.intl.formatMessage(twMessages.compileError, {
                                                    sprite,
                                                    error
                                                })}
                                            </MduiMenuItem>
                                        ))}
                                    </MduiMenu>
                                </MduiDropdown>
                            </div>}
                            {(this.props.canChangeTheme || this.props.canChangeLanguage) && (<SettingsMenu
                                canChangeLanguage={this.props.canChangeLanguage}
                                canChangeTheme={this.props.canChangeTheme}
                                isRtl={this.props.isRtl}
                                onClickDesktopSettings={
                                    this.props.onClickDesktopSettings &&
                                this.handleClickDesktopSettings
                                }
                                // eslint-disable-next-line react/jsx-no-bind
                                onOpenCustomSettings={
                                    this.props.onClickAddonSettings &&
                                this.props.onClickAddonSettings.bind(null, 'editor-theme3')
                                }
                                onRequestClose={this.props.onRequestCloseSettings}
                                onRequestOpen={this.props.onClickSettings}
                                settingsMenuOpen={this.props.settingsMenuOpen}
                            />)}
                            {(this.props.canManageFiles) && (
                                <MduiDropdown
                                    ref={this.fileDropdownRef}
                                    placement={this.props.isRtl ? 'bottom-end' : 'bottom-start'}
                                    onOpened={this.handleFileMenuOpened}
                                    onClosed={this.handleFileMenuClosed}
                                >
                                    <MduiButton
                                        slot="trigger"
                                        variant="text"
                                        icon="folder_open"
                                        className={styles.menuBarItem}
                                    >
                                        {/* The slotted icon shadows the `icon` fallback so it can be
                                            aria-hidden: the ligature codename (e.g. "folder_open")
                                            must not leak into the button's accessible name. */}
                                        <MduiIcon
                                            slot="icon"
                                            name="folder_open"
                                            ariaHidden="true"
                                        />
                                        <span className={styles.collapsibleLabel}>
                                            <FormattedMessage
                                                defaultMessage="文件"
                                                description="Text for file dropdown menu"
                                                id="gui.menuBar.file"
                                            />
                                        </span>
                                    </MduiButton>
                                    <MduiMenu>
                                        <MduiMenuItem
                                            onClick={this.handleClickNew}
                                        >
                                            {newProjectMessage}
                                        </MduiMenuItem>
                                        {this.props.onClickNewWindow && (
                                            <MduiMenuItem
                                                onClick={this.handleClickNewWindow}
                                            >
                                                <FormattedMessage
                                                    defaultMessage="新窗口"
                                                    // eslint-disable-next-line max-len
                                                    description="Part of desktop app. Menu bar item that creates a new window."
                                                    id="tw.menuBar.newWindow"
                                                />
                                            </MduiMenuItem>
                                        )}
                                        {(this.props.canSave || this.props.canCreateCopy || this.props.canRemix) && (
                                            <React.Fragment>
                                                {this.props.canSave && (
                                                    <MduiMenuItem onClick={this.handleClickSave}>
                                                        {saveNowMessage}
                                                    </MduiMenuItem>
                                                )}
                                                {this.props.canCreateCopy && (
                                                    <MduiMenuItem onClick={this.handleClickSaveAsCopy}>
                                                        {createCopyMessage}
                                                    </MduiMenuItem>
                                                )}
                                                {this.props.canRemix && (
                                                    <MduiMenuItem onClick={this.handleClickRemix}>
                                                        {remixMessage}
                                                    </MduiMenuItem>
                                                )}
                                                <MduiDivider />
                                            </React.Fragment>
                                        )}
                                        <MduiMenuItem
                                            onClick={this.props.onStartSelectingFileUpload}
                                        >
                                            {this.props.intl.formatMessage(sharedMessages.loadFromComputerTitle)}
                                        </MduiMenuItem>
                                        <SB3Downloader
                                            showSaveFilePicker={this.props.showSaveFilePicker}
                                        >
                                            {(_className, downloadProject, extended) => (
                                                <React.Fragment>
                                                    {extended.available && (
                                                        <React.Fragment>
                                                            {extended.name !== null && (
                                                            // eslint-disable-next-line max-len
                                                                <MduiMenuItem onClick={this.getSaveToComputerHandler(extended.saveToLastFile)}>
                                                                    <FormattedMessage
                                                                        defaultMessage="保存到 {file}"
                                                                        // eslint-disable-next-line max-len
                                                                        description="Menu bar item to save project to an existing file on the user's computer"
                                                                        id="tw.saveTo"
                                                                        values={{
                                                                            file: extended.name
                                                                        }}
                                                                    />
                                                                </MduiMenuItem>
                                                            )}
                                                            {/* eslint-disable-next-line max-len */}
                                                            <MduiMenuItem onClick={this.getSaveToComputerHandler(extended.saveAsNew)}>
                                                                <FormattedMessage
                                                                    defaultMessage="另存为..."
                                                                    // eslint-disable-next-line max-len
                                                                    description="Menu bar item to select a new file to save the project as"
                                                                    id="tw.saveAs"
                                                                />
                                                            </MduiMenuItem>
                                                        </React.Fragment>
                                                    )}
                                                    {notScratchDesktop() && (
                                                        <MduiMenuItem
                                                            onClick={this.getSaveToComputerHandler(downloadProject)}
                                                        >
                                                            {extended.available ? (
                                                                <FormattedMessage
                                                                    defaultMessage="保存到单独文件..."
                                                                    // eslint-disable-next-line max-len
                                                                    description="Download the project once, without being able to easily save to the same spot"
                                                                    id="tw.oldDownload"
                                                                />
                                                            ) : (
                                                                <FormattedMessage
                                                                    defaultMessage="Save to your computer"
                                                                    description="Menu bar item for downloading a project to your computer" // eslint-disable-line max-len
                                                                    id="gui.menuBar.downloadToComputer"
                                                                />
                                                            )}
                                                        </MduiMenuItem>
                                                    )}
                                                </React.Fragment>
                                            )}
                                        </SB3Downloader>
                                        {this.props.onClickPackager && (
                                            <React.Fragment>
                                                <MduiDivider />
                                                <MduiMenuItem
                                                    onClick={this.handleClickPackager}
                                                >
                                                    <FormattedMessage
                                                        defaultMessage="打包项目"
                                                        // eslint-disable-next-line max-len
                                                        description="Menu bar item to open the current project in the packager"
                                                        id="tw.menuBar.package"
                                                    />
                                                </MduiMenuItem>
                                            </React.Fragment>
                                        )}
                                        <MduiDivider />
                                        <MduiMenuItem onClick={this.handleClickRestorePoints}>
                                            <FormattedMessage
                                                defaultMessage="恢复点"
                                                description="Menu bar item to manage restore points"
                                                id="tw.menuBar.restorePoints"
                                            />
                                        </MduiMenuItem>
                                    </MduiMenu>
                                </MduiDropdown>
                            )}
                            <MduiDropdown
                                ref={this.editDropdownRef}
                                placement={this.props.isRtl ? 'bottom-end' : 'bottom-start'}
                                onOpened={this.handleEditMenuOpened}
                                onClosed={this.handleEditMenuClosed}
                            >
                                <MduiButton
                                    slot="trigger"
                                    variant="text"
                                    icon="edit"
                                    className={styles.menuBarItem}
                                >
                                    <MduiIcon
                                        slot="icon"
                                        name="edit"
                                        ariaHidden="true"
                                    />
                                    <span className={styles.collapsibleLabel}>
                                        <FormattedMessage
                                            defaultMessage="编辑"
                                            description="Text for edit dropdown menu"
                                            id="gui.menuBar.edit"
                                        />
                                    </span>
                                </MduiButton>
                                <MduiMenu>
                                    {this.props.isPlayerOnly ? null : (
                                        <DeletionRestorer>{(handleRestore, {restorable, deletedItem}) => (
                                            <MduiMenuItem
                                                disabled={!restorable}
                                                onClick={this.handleRestoreOption(handleRestore)}
                                            >
                                                {this.restoreOptionMessage(deletedItem)}
                                            </MduiMenuItem>
                                        )}</DeletionRestorer>
                                    )}
                                    <MduiDivider />
                                    <TurboMode>{(toggleTurboMode, {turboMode}) => (
                                        <MduiMenuItem onClick={toggleTurboMode}>
                                            {turboMode ? (
                                                <FormattedMessage
                                                    defaultMessage="关闭加速模式"
                                                    description="Menu bar item for turning off turbo mode"
                                                    id="gui.menuBar.turboModeOff"
                                                />
                                            ) : (
                                                <FormattedMessage
                                                    defaultMessage="开启加速模式"
                                                    description="Menu bar item for turning on turbo mode"
                                                    id="gui.menuBar.turboModeOn"
                                                />
                                            )}
                                        </MduiMenuItem>
                                    )}</TurboMode>
                                    <FramerateChanger>{(changeFramerate, {framerate}) => (
                                        <MduiMenuItem onClick={changeFramerate}>
                                            {framerate === 60 ? (
                                                <FormattedMessage
                                                    defaultMessage="关闭60帧模式"
                                                    description="Menu bar item for turning off 60 FPS mode"
                                                    id="tw.menuBar.60off"
                                                />
                                            ) : (
                                                <FormattedMessage
                                                    defaultMessage="开启60帧模式"
                                                    description="Menu bar item for turning on 60 FPS mode"
                                                    id="tw.menuBar.60on"
                                                />
                                            )}
                                        </MduiMenuItem>
                                    )}</FramerateChanger>
                                    <ChangeUsername>{changeUsername => (
                                        <MduiMenuItem onClick={changeUsername}>
                                            <FormattedMessage
                                                defaultMessage="修改用户名"
                                                description="Menu bar item for changing the username"
                                                id="tw.menuBar.changeUsername"
                                            />
                                        </MduiMenuItem>
                                    )}</ChangeUsername>
                                    {/* eslint-disable-next-line max-len */}
                                    <CloudVariablesToggler>{(toggleCloudVariables, {enabled, canUseCloudVariables}) => (
                                        <MduiMenuItem
                                            disabled={!canUseCloudVariables}
                                            onClick={toggleCloudVariables}
                                        >
                                            {canUseCloudVariables ? (
                                                enabled ? (
                                                    <FormattedMessage
                                                        defaultMessage="禁用云变量"
                                                        description="Menu bar item for disabling cloud variables"
                                                        id="tw.menuBar.cloudOff"
                                                    />
                                                ) : (
                                                    <FormattedMessage
                                                        defaultMessage="启用云变量"
                                                        description="Menu bar item for enabling cloud variables"
                                                        id="tw.menuBar.cloudOn"
                                                    />
                                                )
                                            ) : (
                                                <FormattedMessage
                                                    defaultMessage="云变量不可用"
                                                    // eslint-disable-next-line max-len
                                                    description="Menu bar item for when cloud variables are not available"
                                                    id="tw.menuBar.cloudUnavailable"
                                                />
                                            )}
                                        </MduiMenuItem>
                                    )}</CloudVariablesToggler>
                                    <MduiDivider />
                                    <MduiMenuItem onClick={this.props.onClickSettingsModal}>
                                        <FormattedMessage
                                            defaultMessage="高级设置"
                                            description="Menu bar item for advanced settings"
                                            id="tw.menuBar.moreSettings"
                                        />
                                    </MduiMenuItem>
                                </MduiMenu>
                            </MduiDropdown>
                            {this.props.isTotallyNormal && (
                                <MduiDropdown
                                    ref={this.modeDropdownRef}
                                    placement={this.props.isRtl ? 'bottom-end' : 'bottom-start'}
                                    onOpened={this.handleModeMenuOpened}
                                    onClosed={this.handleModeMenuClosed}
                                >
                                    <MduiButton
                                        slot="trigger"
                                        variant="text"
                                        className={styles.menuBarItem}
                                    >
                                        <FormattedMessage
                                            defaultMessage="模式"
                                            description="Mode menu item in the menu bar"
                                            id="gui.menuBar.modeMenu"
                                        />
                                    </MduiButton>
                                    <MduiMenu>
                                        <MduiMenuItem onClick={this.handleSetMode('NOW')}>
                                            <span className={classNames({[styles.inactive]: !this.props.modeNow})}>
                                                {'✓'}
                                            </span>
                                            {' '}
                                            <FormattedMessage
                                                defaultMessage="普通模式"
                                                description="April fools: resets editor to not have any pranks"
                                                id="gui.menuBar.normalMode"
                                            />
                                        </MduiMenuItem>
                                        <MduiMenuItem onClick={this.handleSetMode('2020')}>
                                            <span className={classNames({[styles.inactive]: !this.props.mode2020})}>
                                                {'✓'}
                                            </span>
                                            {' '}
                                            <FormattedMessage
                                                defaultMessage="猫咪模式"
                                                description="April fools: Cat blocks mode"
                                                id="gui.menuBar.caturdayMode"
                                            />
                                        </MduiMenuItem>
                                    </MduiMenu>
                                </MduiDropdown>
                            )}

                            {this.props.onClickAddonSettings && (
                                <MduiButton
                                    variant="text"
                                    icon="extension"
                                    className={styles.menuBarItem}
                                    onClick={this.props.onClickAddonSettings}
                                >
                                    <MduiIcon
                                        slot="icon"
                                        name="extension"
                                        ariaHidden="true"
                                    />
                                    <span className={styles.collapsibleLabel}>
                                        <FormattedMessage
                                            defaultMessage="插件"
                                            description="Button to open addon settings"
                                            id="tw.menuBar.addons"
                                        />
                                    </span>
                                </MduiButton>
                            )}
                            {this.props.onClickSettingsModal && (
                                <MduiButton
                                    variant="text"
                                    icon="tune"
                                    className={styles.menuBarItem}
                                    onClick={this.props.onClickSettingsModal}
                                >
                                    <MduiIcon
                                        slot="icon"
                                        name="tune"
                                        ariaHidden="true"
                                    />
                                    <span className={styles.collapsibleLabel}>
                                        <FormattedMessage
                                            defaultMessage="高级"
                                            description="Button to open advanced settings menu"
                                            id="tw.menuBar.advanced"
                                        />
                                    </span>
                                </MduiButton>
                            )}
                        </div>

                        <Divider className={styles.divider} />

                        {this.props.canEditTitle ? (
                            <div className={classNames(styles.menuBarItem, styles.growable)}>
                                <MenuBarItemTooltip
                                    enable
                                    id="title-field"
                                >
                                    <ProjectTitleInput
                                        className={classNames(styles.titleFieldGrowable)}
                                    />
                                </MenuBarItemTooltip>
                            </div>
                        ) : ((this.props.authorUsername && this.props.authorUsername !== this.props.username) ? (
                            <AuthorInfo
                                className={styles.authorInfo}
                                imageUrl={this.props.authorThumbnailUrl}
                                projectId={this.props.projectId}
                                projectTitle={this.props.projectTitle}
                                userId={this.props.authorId}
                                username={this.props.authorUsername}
                            />
                        ) : null)}
                        {this.props.canShare ? (
                            (this.props.isShowingProject || this.props.isUpdating) && (
                                <div className={classNames(styles.menuBarItem)}>
                                    <ProjectWatcher onDoneUpdating={this.props.onSeeCommunity}>
                                        {
                                            waitForUpdate => (
                                                <ShareButton
                                                    className={styles.menuBarButton}
                                                    isShared={this.props.isShared}
                                                    /* eslint-disable react/jsx-no-bind */
                                                    onClick={() => {
                                                        this.handleClickShare(waitForUpdate);
                                                    }}
                                                /* eslint-enable react/jsx-no-bind */
                                                />
                                            )
                                        }
                                    </ProjectWatcher>
                                </div>
                            )
                        ) : this.props.showComingSoon ? (
                            <div className={classNames(styles.menuBarItem)}>
                                <MenuBarItemTooltip id="share-button">
                                    <ShareButton className={styles.menuBarButton} />
                                </MenuBarItemTooltip>
                            </div>
                        ) : null}
                        {this.props.canRemix && (
                            <div className={classNames(styles.menuBarItem)}>
                                {remixButton}
                            </div>
                        )}
                        <div className={classNames(styles.menuBarItem, styles.communityButtonWrapper)}>
                            {this.props.enableCommunity ? (
                                (this.props.isShowingProject || this.props.isUpdating) && (
                                    <ProjectWatcher onDoneUpdating={this.props.onSeeCommunity}>
                                        {
                                            waitForUpdate => (
                                                <CommunityButton
                                                    className={styles.menuBarButton}
                                                    /* eslint-disable react/jsx-no-bind */
                                                    onClick={() => {
                                                        this.handleClickSeeCommunity(waitForUpdate);
                                                    }}
                                                /* eslint-enable react/jsx-no-bind */
                                                />
                                            )
                                        }
                                    </ProjectWatcher>
                                )
                            ) : (this.props.showComingSoon ? (
                                <MenuBarItemTooltip id="community-button">
                                    <CommunityButton className={styles.menuBarButton} />
                                </MenuBarItemTooltip>
                            ) : (this.props.enableSeeInside ? (
                                <SeeInsideButton
                                    className={styles.menuBarButton}
                                    onClick={this.handleClickSeeInside}
                                />
                            ) : []))}
                        </div>
                        {/* tw: add a feedback button */}
                        <div className={styles.menuBarItem}>
                            <MduiButton
                                className={styles.feedbackButton}
                                onClick={this.props.onClickFeedback}
                            >
                                <FormattedMessage
                                    defaultMessage="{APP_NAME} Feedback"
                                    description="Button to give feedback in the menu bar"
                                    id="tw.feedbackButton"
                                    values={{
                                        APP_NAME
                                    }}
                                />
                            </MduiButton>
                        </div>

                    </div>

                    <div className={styles.accountInfoGroup}>
                        <TWSaveStatus
                            showSaveFilePicker={this.props.showSaveFilePicker}
                        />
                    </div>

                    {aboutButton}
                </div>
            </Box>
        );

        return (
            <React.Fragment>
                {menuBar}
            </React.Fragment>
        );
    }
}

MenuBar.propTypes = {
    enableSeeInside: PropTypes.bool,
    onClickSeeInside: PropTypes.func,
    aboutMenuOpen: PropTypes.bool,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    autoUpdateProject: PropTypes.func,
    canChangeLanguage: PropTypes.bool,
    canChangeTheme: PropTypes.bool,
    logo: PropTypes.string,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    className: PropTypes.string,
    errors: PropTypes.arrayOf(PropTypes.shape({
        sprite: PropTypes.string,
        error: PropTypes.string,
        id: PropTypes.number
    })),
    errorsMenuOpen: PropTypes.bool,
    onClickErrors: PropTypes.func,
    onRequestCloseErrors: PropTypes.func,
    confirmReadyToReplaceProject: PropTypes.func,
    editMenuOpen: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    fileMenuOpen: PropTypes.bool,
    handleSaveProject: PropTypes.func,
    intl: intlShape,
    isPlayerOnly: PropTypes.bool,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    isShowingProject: PropTypes.bool,
    isTotallyNormal: PropTypes.bool,
    isUpdating: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    menuBarAlignment: PropTypes.string,
    mode2020: PropTypes.bool,
    modeMenuOpen: PropTypes.bool,
    modeNow: PropTypes.bool,
    onClickAbout: PropTypes.oneOfType([
        PropTypes.func, // button mode: call this callback when the About button is clicked
        PropTypes.arrayOf( // menu mode: list of items in the About menu
            PropTypes.shape({
                title: PropTypes.string, // text for the menu item
                onClick: PropTypes.func // call this callback when the menu item is clicked
            })
        )
    ]),
    onClickAddonSettings: PropTypes.func,
    onClickDesktopSettings: PropTypes.func,
    onClickPackager: PropTypes.func,
    onClickRestorePoints: PropTypes.func,
    onClickEdit: PropTypes.func,
    onClickFile: PropTypes.func,
    onClickFeedback: PropTypes.func,

    onClickMode: PropTypes.func,
    onClickNew: PropTypes.func,
    onClickNewWindow: PropTypes.func,
    onClickRemix: PropTypes.func,
    onClickSave: PropTypes.func,
    onClickSaveAsCopy: PropTypes.func,
    onClickSettings: PropTypes.func,
    onClickSettingsModal: PropTypes.func,
    onProjectTelemetryEvent: PropTypes.func,
    onRequestCloseAbout: PropTypes.func,
    onRequestCloseEdit: PropTypes.func,
    onRequestCloseFile: PropTypes.func,
    onRequestCloseMode: PropTypes.func,
    onRequestCloseSettings: PropTypes.func,
    onRequestOpenAbout: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onSetTimeTravelMode: PropTypes.func,
    onShare: PropTypes.func,
    onStartSelectingFileUpload: PropTypes.func,
    projectId: PropTypes.string,
    projectTitle: PropTypes.string,
    settingsMenuOpen: PropTypes.bool,
    shouldSaveBeforeTransition: PropTypes.func,
    showSaveFilePicker: PropTypes.func,
    showComingSoon: PropTypes.bool,
    username: PropTypes.string,
    vm: PropTypes.instanceOf(VM).isRequired
};

MenuBar.defaultProps = {
    onShare: () => {}
};

const mapStateToProps = state => {
    const loadingState = state.scratchGui.projectState.loadingState;
    const user = state.session && state.session.session && state.session.session.user;
    return {
        authorUsername: state.scratchGui.tw.author.username,
        authorThumbnailUrl: state.scratchGui.tw.author.thumbnail,
        projectId: state.scratchGui.projectState.projectId,
        aboutMenuOpen: aboutMenuOpen(state),
        fileMenuOpen: fileMenuOpen(state),
        editMenuOpen: editMenuOpen(state),
        errors: state.scratchGui.tw.compileErrors,
        errorsMenuOpen: errorsMenuOpen(state),
        isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
        isRtl: state.locales.isRtl,
        isUpdating: getIsUpdating(loadingState),
        isShowingProject: getIsShowingProject(loadingState),
        locale: state.locales.locale,
        modeMenuOpen: modeMenuOpen(state),
        projectTitle: state.scratchGui.projectTitle,
        settingsMenuOpen: settingsMenuOpen(state),
        username: user ? user.username : null,
        vm: state.scratchGui.vm,
        menuBarAlignment: state.scratchGui.tw.menuBarAlignment,
        mode220022BC: isTimeTravel220022BC(state),
        mode1920: isTimeTravel1920(state),
        mode1990: isTimeTravel1990(state),
        mode2020: isTimeTravel2020(state),
        modeNow: isTimeTravelNow(state)
    };
};

const mapDispatchToProps = dispatch => ({
    onClickSeeInside: () => dispatch(setPlayer(false)),
    autoUpdateProject: () => dispatch(autoUpdateProject()),
    onOpenTipLibrary: () => dispatch(openTipsLibrary()),
    onClickFile: () => dispatch(openFileMenu()),
    onRequestCloseFile: () => dispatch(closeFileMenu()),
    onClickEdit: () => dispatch(openEditMenu()),
    onRequestCloseEdit: () => dispatch(closeEditMenu()),
    onClickErrors: () => dispatch(openErrorsMenu()),
    onRequestCloseErrors: () => dispatch(closeErrorsMenu()),
    onClickMode: () => dispatch(openModeMenu()),
    onRequestCloseMode: () => dispatch(closeModeMenu()),
    onRequestOpenAbout: () => dispatch(openAboutMenu()),
    onRequestCloseAbout: () => dispatch(closeAboutMenu()),
    onClickRestorePoints: () => dispatch(openRestorePointModal()),
    onClickFeedback: () => dispatch(openFeedbackModal()),
    onClickSettings: () => dispatch(openSettingsMenu()),
    onClickSettingsModal: () => {
        dispatch(closeEditMenu());
        dispatch(openSettingsModal());
    },
    onRequestCloseSettings: () => dispatch(closeSettingsMenu()),
    onClickNew: needSave => {
        dispatch(requestNewProject(needSave));
        dispatch(setFileHandle(null));
    },
    onClickRemix: () => dispatch(remixProject()),
    onClickSave: () => dispatch(manualUpdateProject()),
    onClickSaveAsCopy: () => dispatch(saveProjectAsCopy()),
    onSeeCommunity: () => dispatch(setPlayer(true)),
    onSetTimeTravelMode: mode => dispatch(setTimeTravel(mode))
});

export default compose(
    injectIntl,
    MenuBarHOC,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(MenuBar);
