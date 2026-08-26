import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import AudioSelectorComponent from '../components/audio-trimmer/audio-selector.jsx';
import {getEventXY} from '../lib/touch-utils';
import DragRecognizer from '../lib/drag-recognizer';

const MIN_LENGTH = 0.01;
const MIN_DURATION = 500;

class AudioSelector extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleNewSelectionMouseDown',
            'handleTrimStartMouseDown',
            'handleTrimEndMouseDown',
            'handleTrimStartMouseMove',
            'handleTrimEndMouseMove',
            'handleTrimStartMouseUp',
            'handleTrimEndMouseUp',
            'currentTrim',
            'storeRef'
        ]);

        // Trim values live in props; the state below is only a draft used
        // while the user is dragging a handle, so there is a single source
        // of truth outside of an active drag.
        this.state = {
            dragTrim: null
        };

        this.clickStartTime = 0;

        this.trimStartDragRecognizer = new DragRecognizer({
            onDrag: this.handleTrimStartMouseMove,
            onDragEnd: this.handleTrimStartMouseUp,
            touchDragAngle: 90,
            distanceThreshold: 0
        });
        this.trimEndDragRecognizer = new DragRecognizer({
            onDrag: this.handleTrimEndMouseMove,
            onDragEnd: this.handleTrimEndMouseUp,
            touchDragAngle: 90,
            distanceThreshold: 0
        });
    }
    currentTrim () {
        return this.state.dragTrim || {
            trimStart: this.props.trimStart,
            trimEnd: this.props.trimEnd
        };
    }
    clearSelection () {
        this.props.onSetTrim(null, null);
    }
    handleNewSelectionMouseDown (e) {
        const {width, left} = this.containerElement.getBoundingClientRect();
        this.initialTrimEnd = (getEventXY(e).x - left) / width;
        this.initialTrimStart = this.initialTrimEnd;
        this.props.onSetTrim(this.initialTrimStart, this.initialTrimEnd);

        this.clickStartTime = Date.now();

        this.containerSize = width;
        this.trimEndDragRecognizer.start(e);

        e.preventDefault();
    }
    handleTrimStartMouseMove (currentOffset, initialOffset) {
        const dx = (currentOffset.x - initialOffset.x) / this.containerSize;
        const newTrim = Math.max(0, Math.min(1, this.initialTrimStart + dx));
        if (newTrim > this.initialTrimEnd) {
            this.setState({
                dragTrim: {
                    trimStart: this.initialTrimEnd,
                    trimEnd: newTrim
                }
            });
        } else {
            this.setState({
                dragTrim: {
                    trimStart: newTrim,
                    trimEnd: this.initialTrimEnd
                }
            });
        }
    }
    handleTrimEndMouseMove (currentOffset, initialOffset) {
        const dx = (currentOffset.x - initialOffset.x) / this.containerSize;
        const newTrim = Math.min(1, Math.max(0, this.initialTrimEnd + dx));
        if (newTrim < this.initialTrimStart) {
            this.setState({
                dragTrim: {
                    trimStart: newTrim,
                    trimEnd: this.initialTrimStart
                }
            });
        } else {
            this.setState({
                dragTrim: {
                    trimStart: this.initialTrimStart,
                    trimEnd: newTrim
                }
            });
        }
    }
    handleTrimStartMouseUp () {
        const {trimStart, trimEnd} = this.currentTrim();
        this.setState({dragTrim: null});
        this.props.onSetTrim(trimStart, trimEnd);
    }
    handleTrimEndMouseUp () {
        // If the selection was made quickly (tooFast) and is small (tooShort),
        // deselect instead. This allows click-to-deselect even if you drag
        // a little bit by accident. It also allows very quickly making a
        // selection, as long as it is above a minimum length.
        const {trimStart, trimEnd} = this.currentTrim();
        const tooFast = (Date.now() - this.clickStartTime) < MIN_DURATION;
        const tooShort = (trimEnd - trimStart) < MIN_LENGTH;
        this.setState({dragTrim: null});
        if (tooFast && tooShort) {
            this.clearSelection();
        } else {
            this.props.onSetTrim(trimStart, trimEnd);
        }
    }
    handleTrimStartMouseDown (e) {
        this.containerSize = this.containerElement.getBoundingClientRect().width;
        this.trimStartDragRecognizer.start(e);
        this.initialTrimStart = this.props.trimStart;
        this.initialTrimEnd = this.props.trimEnd;
        e.stopPropagation();
        e.preventDefault();
    }
    handleTrimEndMouseDown (e) {
        this.containerSize = this.containerElement.getBoundingClientRect().width;
        this.trimEndDragRecognizer.start(e);
        this.initialTrimEnd = this.props.trimEnd;
        this.initialTrimStart = this.props.trimStart;
        e.stopPropagation();
        e.preventDefault();
    }
    storeRef (el) {
        this.containerElement = el;
    }
    render () {
        const trim = this.currentTrim();
        return (
            <AudioSelectorComponent
                containerRef={this.storeRef}
                playhead={this.props.playhead}
                trimEnd={trim.trimEnd}
                trimStart={trim.trimStart}
                onNewSelectionMouseDown={this.handleNewSelectionMouseDown}
                onTrimEndMouseDown={this.handleTrimEndMouseDown}
                onTrimStartMouseDown={this.handleTrimStartMouseDown}
            />
        );
    }
}

AudioSelector.propTypes = {
    onSetTrim: PropTypes.func,
    playhead: PropTypes.number,
    trimEnd: PropTypes.number,
    trimStart: PropTypes.number
};

export default AudioSelector;
