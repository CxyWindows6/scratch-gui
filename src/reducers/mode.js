const SET_FULL_SCREEN = 'scratch-gui/mode/SET_FULL_SCREEN';
const SET_PLAYER = 'scratch-gui/mode/SET_PLAYER';
const SET_FULLSCREEN_RETURN_MODE = 'scratch-gui/mode/SET_FULLSCREEN_RETURN_MODE';
const SET_PLAYER_FROM_RETURN_MODE = 'scratch-gui/mode/SET_PLAYER_FROM_RETURN_MODE';

const initialState = {
    isEmbedded: false,
    isFullScreen: false,
    isPlayerOnly: false,
    hasEverEnteredEditor: true,
    fullscreenReturnMode: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_FULL_SCREEN:
        return Object.assign({}, state, {
            isFullScreen: action.isFullScreen
        });
    case SET_PLAYER:
        return Object.assign({}, state, {
            isPlayerOnly: action.isPlayerOnly,
            hasEverEnteredEditor: state.hasEverEnteredEditor || !action.isPlayerOnly
        });
    case SET_FULLSCREEN_RETURN_MODE:
        return Object.assign({}, state, {
            fullscreenReturnMode: action.mode
        });
    case SET_PLAYER_FROM_RETURN_MODE:
        return Object.assign({}, state, {
            isPlayerOnly: state.fullscreenReturnMode,
            hasEverEnteredEditor: state.hasEverEnteredEditor || !state.fullscreenReturnMode
        });
    default:
        return state;
    }
};

const setFullScreen = function (isFullScreen) {
    return {
        type: SET_FULL_SCREEN,
        isFullScreen: isFullScreen
    };
};
const setPlayer = function (isPlayerOnly) {
    return {
        type: SET_PLAYER,
        isPlayerOnly: isPlayerOnly
    };
};
const setFullscreenReturnMode = function (mode) {
    return {
        type: SET_FULLSCREEN_RETURN_MODE,
        mode: mode
    };
};
const setPlayerFromReturnMode = function () {
    return {
        type: SET_PLAYER_FROM_RETURN_MODE
    };
};

export {
    reducer as default,
    initialState as modeInitialState,
    setFullScreen,
    setPlayer,
    setFullscreenReturnMode,
    setPlayerFromReturnMode
};
