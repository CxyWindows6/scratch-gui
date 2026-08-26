import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import ScanningStepComponent from '../components/connection-modal/scanning-step.jsx';
import VM from 'scratch-vm';

class ScanningStep extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handlePeripheralListUpdate',
            'handlePeripheralScanTimeout',
            'handleRefresh',
            'handleConnecting',
            'stopPeripheralScan'
        ]);
        // Set once a connect attempt is started, so unmounting this step won't cancel it.
        this.connectInitiated = false;
        this.state = {
            scanning: true,
            peripheralList: []
        };
    }
    componentDidMount () {
        this.props.vm.scanForPeripheral(this.props.extensionId);
        this.props.vm.on(
            'PERIPHERAL_LIST_UPDATE', this.handlePeripheralListUpdate);
        this.props.vm.on(
            'PERIPHERAL_SCAN_TIMEOUT', this.handlePeripheralScanTimeout);
    }
    componentWillUnmount () {
        this.stopPeripheralScan();
        this.props.vm.removeListener(
            'PERIPHERAL_LIST_UPDATE', this.handlePeripheralListUpdate);
        this.props.vm.removeListener(
            'PERIPHERAL_SCAN_TIMEOUT', this.handlePeripheralScanTimeout);
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
            scanning: false,
            peripheralList: []
        });
    }
    handlePeripheralListUpdate (newList) {
        // TODO: sort peripherals by signal strength? so they don't jump around
        const peripheralArray = Object.keys(newList).map(id =>
            newList[id]
        );
        this.setState({peripheralList: peripheralArray});
    }
    handleRefresh () {
        this.props.vm.scanForPeripheral(this.props.extensionId);
        this.setState({
            scanning: true,
            peripheralList: []
        });
    }
    handleConnecting (peripheralId) {
        this.connectInitiated = true;
        this.props.onConnecting(peripheralId);
    }
    render () {
        return (
            <ScanningStepComponent
                connectionSmallIconURL={this.props.connectionSmallIconURL}
                peripheralList={this.state.peripheralList}
                scanning={this.state.scanning}
                onConnected={this.props.onConnected}
                onConnecting={this.handleConnecting}
                onRefresh={this.handleRefresh}
                onUpdatePeripheral={this.props.onUpdatePeripheral}
            />
        );
    }
}

ScanningStep.propTypes = {
    connectionSmallIconURL: PropTypes.string,
    extensionId: PropTypes.string.isRequired,
    onConnected: PropTypes.func.isRequired,
    onConnecting: PropTypes.func.isRequired,
    onUpdatePeripheral: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default ScanningStep;
