import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import ScanningStepComponent, {PHASES} from '../components/connection-modal/auto-scanning-step.jsx';
import VM from 'scratch-vm';

class AutoScanningStep extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handlePeripheralListUpdate',
            'handlePeripheralScanTimeout',
            'handleStartScan',
            'handleRefresh',
            'stopPeripheralScan'
        ]);
        // Set once a connect attempt is started, so unmounting this step won't cancel it.
        this.connectInitiated = false;
        this.state = {
            phase: PHASES.prescan
        };
    }
    componentWillUnmount () {
        this.stopPeripheralScan();
        this.unbindPeripheralUpdates();
    }
    stopPeripheralScan () {
        // The VM has no dedicated scan-stop API; disconnecting the peripheral
        // closes the scratch-link socket and clears the discover timeout,
        // which stops an in-progress scan. Skip it if we just started
        // connecting, since that uses the same socket.
        if (this.connectInitiated) return;
        if (!this.props.vm.getPeripheralIsConnected(this.props.extensionId)) {
            this.props.vm.disconnectPeripheral(this.props.extensionId);
        }
    }
    handlePeripheralScanTimeout () {
        this.setState({
            phase: PHASES.notfound
        });
        this.unbindPeripheralUpdates();
    }
    handlePeripheralListUpdate (newList) {
        // TODO: sort peripherals by signal strength? so they don't jump around
        const peripheralArray = Object.keys(newList).map(id =>
            newList[id]
        );
        if (peripheralArray.length > 0) {
            this.connectInitiated = true;
            this.props.onConnecting(peripheralArray[0].peripheralId);
        }
    }
    bindPeripheralUpdates () {
        this.props.vm.on(
            'PERIPHERAL_LIST_UPDATE', this.handlePeripheralListUpdate);
        this.props.vm.on(
            'PERIPHERAL_SCAN_TIMEOUT', this.handlePeripheralScanTimeout);
    }
    unbindPeripheralUpdates () {
        this.props.vm.removeListener(
            'PERIPHERAL_LIST_UPDATE', this.handlePeripheralListUpdate);
        this.props.vm.removeListener(
            'PERIPHERAL_SCAN_TIMEOUT', this.handlePeripheralScanTimeout);
    }
    handleRefresh () {
        // Stop any in-progress scan before resetting (abort button / try again).
        this.stopPeripheralScan();
        this.setState({
            phase: PHASES.prescan
        });
        this.unbindPeripheralUpdates();
    }
    handleStartScan () {
        this.bindPeripheralUpdates();
        this.props.vm.scanForPeripheral(this.props.extensionId);
        this.setState({
            phase: PHASES.pressbutton
        });

    }
    render () {
        return (
            <ScanningStepComponent
                connectionTipIconURL={this.props.connectionTipIconURL}
                phase={this.state.phase}
                onRefresh={this.handleRefresh}
                onStartScan={this.handleStartScan}
                onUpdatePeripheral={this.props.onUpdatePeripheral}
            />
        );
    }
}

AutoScanningStep.propTypes = {
    connectionTipIconURL: PropTypes.string,
    extensionId: PropTypes.string.isRequired,
    onConnecting: PropTypes.func.isRequired,
    onUpdatePeripheral: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default AutoScanningStep;
