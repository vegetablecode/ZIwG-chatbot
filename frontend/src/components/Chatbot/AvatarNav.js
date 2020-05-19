import React, { Component } from 'react';
import { Avatar, AvatarMenu, MenuDivider, MenuItem } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faPowerOff, faUserShield, faCog } from '@fortawesome/free-solid-svg-icons';
import userDefaultAvatar from "../../assets/avatars/userDefault.png";
import { connect } from 'react-redux';

import { NavLink, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import {
    getRequests,
} from "../../actions/requestActions";
import {
    logout,
    getIsAdmin,
    clearConversation
} from "../../actions/securityActions";

class AvatarNav extends Component {
    logout = e => {
        this.props.logout();
        window.location.href = "/";
    };

    componentDidMount() {
        this.props.getIsAdmin();
    }

    clearUserConversation = () => {
        this.props.clearConversation();
        let pages = {
            page: 0
        };
        this.props.getRequests(pages);
    };

    render() {
        const { validToken, user } = this.props.security;
        const isAdmin = this.props.security.isAdmin;

        let dropdownLinks;
        if (isAdmin) {
            dropdownLinks = (<React.Fragment>
                <MenuItem
                    label="Admin Panel"
                    icon={<FontAwesomeIcon icon={faUserShield} />}
                    iconPosition="left"
                    onClick={() => this.props.history.push("/dashboard")}
                />
                <MenuDivider variant="space" />
                <MenuItem
                    label="New Conversation"
                    icon={<FontAwesomeIcon icon={faComments} />}
                    iconPosition="left"
                />
                <MenuItem
                    label="Settings"
                    icon={<FontAwesomeIcon icon={faCog} />}
                    iconPosition="left"
                />
                <MenuItem
                    label="Logout"
                    icon={<FontAwesomeIcon icon={faPowerOff} />}
                    iconPosition="left"
                />
            </React.Fragment>);
        } else {
            dropdownLinks = (<React.Fragment>
                <MenuItem
                    label="New Conversation"
                    icon={<FontAwesomeIcon icon={faComments} />}
                    iconPosition="left"
                />
                <MenuItem
                    label="Settings"
                    icon={<FontAwesomeIcon icon={faCog} />}
                    iconPosition="left"
                />
                <MenuItem
                    label="Logout"
                    icon={<FontAwesomeIcon icon={faPowerOff} />}
                    iconPosition="left"
                />
            </React.Fragment>);
        }

        return (
            <AvatarMenu
                className="rainbow-m-horizontal_medium"
                id="avatar-menu"
                src={this.props.security.avatar === '' ? userDefaultAvatar : this.props.security.avatar}
                assistiveText="Tahimi Leon"
                menuAlignment="right"
                menuSize="small"
                avatarSize="large"
                title="Tahimi Leon"
            >
                {dropdownLinks}
            </AvatarMenu>
        )
    }
}

AvatarNav.propTypes = {
    logout: PropTypes.func.isRequired,
    security: PropTypes.object.isRequired,
    getIsAdmin: PropTypes.func.isRequired,
    clearConversation: PropTypes.func.isRequired,
    getRequests: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    errors: state.errors,
    security: state.security,
});

export default connect(mapStateToProps, { logout, getIsAdmin, clearConversation, getRequests })(withRouter(AvatarNav));