import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import {connect} from 'react-redux';
import StudioView from '../tw-studioview/studioview.jsx';
import styles from './featured-projects.css';
import {setProjectId} from '../../lib/tw-navigation-utils.js';
import classNames from 'classnames';

const messages = defineMessages({
    viewFeaturedProjects: {
        defaultMessage: 'View featured projects',
        description: 'Accessible label for the button that reveals the featured projects',
        id: 'tw.featuredProjects.view'
    }
});

class FeaturedProjects extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleSelect',
            'handleOpenProjects',
            'handleOpenerKeyDown'
        ]);
        this.state = {
            opened: false,
            transition: true
        };
    }
    componentDidUpdate (prevProps) {
        if (this.props.projectId === '0' && prevProps.projectId === null) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                opened: true,
                transition: false
            });
        }
    }
    handleSelect (id) {
        this.props.setProjectId(id);
    }
    handleOpenProjects () {
        this.setState({
            opened: true
        });
    }
    handleOpenerKeyDown (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleOpenProjects();
        }
    }
    render () {
        const opened = this.state.opened;
        return (
            <div className={styles.container}>
                <div
                    className={classNames(
                        styles.projects,
                        {
                            [styles.opened]: opened,
                            [styles.transition]: this.state.transition
                        }
                    )}
                >
                    <StudioView
                        id={this.props.studio}
                        onSelect={this.handleSelect}
                        placeholder={!opened}
                    />
                    {opened ? null : (
                        <div
                            className={styles.openerContainer}
                            role="button"
                            tabIndex={0}
                            aria-label={this.props.intl.formatMessage(messages.viewFeaturedProjects)}
                            onClick={this.handleOpenProjects}
                            onKeyDown={this.handleOpenerKeyDown}
                        >
                            <div className={styles.openerContent}>
                                <FormattedMessage
                                    defaultMessage="Click to view featured projects."
                                    description="Text to view featured projects"
                                    id="tw.viewFeaturedProjects"
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.footer}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://scratch.mit.edu/studios/${this.props.studio}/`}
                    >
                        <FormattedMessage
                            defaultMessage="View studio on Scratch."
                            description="Link to turbowarp featured projects studio"
                            id="tw.featuredProjectsStudio"
                        />
                    </a>
                </div>
            </div>
        );
    }
}

FeaturedProjects.propTypes = {
    intl: intlShape,
    setProjectId: PropTypes.func,
    projectId: PropTypes.string,
    studio: PropTypes.string
};

const mapStateToProps = state => ({
    projectId: state.scratchGui.projectState.projectId
});

const mapDispatchToProps = dispatch => ({
    setProjectId: projectId => setProjectId(dispatch, projectId)
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(FeaturedProjects));
