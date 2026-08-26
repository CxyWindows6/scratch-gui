import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import SliderPromptComponent from '../components/slider-prompt/slider-prompt.jsx';

class SliderPrompt extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleOk',
            'handleCancel',
            'handleChangeMin',
            'handleChangeMax',
            'handleKeyPress',
            'validates',
            'shouldBeDiscrete'
        ]);

        const {isDiscrete, minValue, maxValue} = this.props;
        this.state = {
            // For internal use, convert values to strings based on isDiscrete
            // This is because `<input />` always returns values as strings.
            minValue: isDiscrete ? minValue.toFixed(0) : minValue.toFixed(2),
            maxValue: isDiscrete ? maxValue.toFixed(0) : maxValue.toFixed(2),
            minError: false,
            maxError: false,
            // Bumped on every failed submit attempt so the component re-focuses
            // the first invalid field even when nothing else changed.
            errorNonce: 0
        };
    }
    handleKeyPress (event) {
        if (event.key === 'Enter') this.handleOk();
    }
    handleOk () {
        const {minValue, maxValue} = this.state;
        const minValid = this.validates(minValue);
        const maxValid = this.validates(maxValue);
        if (!minValid || !maxValid) {
            // Validation failed: show the error state and focus the first
            // invalid field instead of silently cancelling the dialog.
            // Nothing is passed downstream until both fields parse to a
            // finite number (no NaN can reach onOk).
            this.setState(prevState => ({
                minError: !minValid,
                maxError: !maxValid,
                errorNonce: prevState.errorNonce + 1
            }));
            return;
        }
        this.props.onOk(
            parseFloat(minValue),
            parseFloat(maxValue),
            this.shouldBeDiscrete(minValue, maxValue));
    }
    handleCancel () {
        this.props.onCancel();
    }
    handleChangeMin (e) {
        this.setState({minValue: e.target.value, minError: false});
    }
    handleChangeMax (e) {
        this.setState({maxValue: e.target.value, maxError: false});
    }
    shouldBeDiscrete (min, max) {
        return min.indexOf('.') + max.indexOf('.') === -2; // Both -1
    }
    validates (value) {
        // An empty string would sneak through isFinite() as 0 and parseFloat('')
        // is NaN, so empty input must be rejected explicitly.
        return typeof value === 'string' &&
            value.trim() !== '' &&
            isFinite(value);
    }
    render () {
        return (
            <SliderPromptComponent
                errorNonce={this.state.errorNonce}
                maxError={this.state.maxError}
                maxValue={this.state.maxValue}
                minError={this.state.minError}
                minValue={this.state.minValue}
                onCancel={this.handleCancel}
                onChangeMax={this.handleChangeMax}
                onChangeMin={this.handleChangeMin}
                onKeyPress={this.handleKeyPress}
                onOk={this.handleOk}
            />
        );
    }
}

SliderPrompt.propTypes = {
    isDiscrete: PropTypes.bool,
    maxValue: PropTypes.number,
    minValue: PropTypes.number,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired
};

SliderPrompt.defaultProps = {
    maxValue: 100,
    minValue: 0,
    isDiscrete: true
};

export default SliderPrompt;
