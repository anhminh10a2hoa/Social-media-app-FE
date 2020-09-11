import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
// MUI stuff
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ToolTip from '@material-ui/core/ToolTip';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
// Icons
import NotificationsIcon from '@material-ui/icons/Notifications';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';
// Redux stuff
import { connect } from "react-redux";
import { markNotificationsRead } from "../../redux/actions/userActions";

class Notifications extends Component {
  state = {
    anchorE1: null
  };
  handleOpen = (event) => {
    this.setState({ anchorE1: event.target.value });
  }
  handleClose = (event) => {
    this.setState({ anchorE1: null });
  }
  onMenuOpened = () => {
    let unreadNotificationsIds = this.props.notifications.filter(notification => !notification.read).map(notification => notification.notificationId)
    this.props.markNotificationsRead(unreadNotificationsIds);
  }
  render(){
    const notifications = this.props.notifications;
    const anchorE1 = this.state.anchorE1;

    dayjs.extend(relativeTime);

    let notificationIcon;
    if(notifications && notifications.length > 0){
      notifications.filter(notification => notification.red === false).length > 0 
        ? notificationIcon = (
          <Badge badgeContent={notifications.filter(notification => notification.red === false).length} color="secondary">
            <NotificationsIcon/>
          </Badge>
        ) : (
          notificationIcon  = <NotificationsIcon/>
        )
      } else {
        notificationIcon  = <NotificationsIcon/>
      }

    let notificationsMarkup = notifications && notifications.length > 0 ? (
      notifications.map(notification => {
        const verb = notification.type === 'like' ? 'liked' : 'commented on';
        const time = dayjs(notification.createdAt).fromNow();
        const iconColor = notification.read ? 'primary' : 'secondary';
        const icon = notification.type === 'like' ? (
          <FavoriteIcon color={iconColor} style={{ marginRight: 10 }}/>
        ) : (
          <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
        )

        return (
          <MenuItem key={notification.createdAt} onClick={this.handleClose}>
            {icon}
            <Typography component={Link} color="default" variant="body1" to={`/users/${notification.recipient}/scream/${notification.screamId}`}>
              {notification.sender} {verb} your scream {time}
            </Typography>
          </MenuItem>
        )
      })
    ) : (
      <MenuItem onClick={this.handleClick}>
        You have notifications yet
      </MenuItem>
    )
      return (
        <Fragment>
          <ToolTip placement="top" title="Notifications">
            <IconButton aria-owns={anchorE1 ? 'simple-menu' : undefined} aria-haspopup="true" onClick={this.handleOpen}>
              {notificationIcon}
            </IconButton>
          </ToolTip>
          <Menu anchorE1={anchorE1} open={Boolean(anchorE1)} onClose={this.handleClose} onEnter={this.onMenuOpened}>
            {notificationsMarkup}
          </Menu>
        </Fragment>
      )
  }
}

Notifications.propTypes = {
  markNotificationsRead: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  notifications: state.user.notifications
})

export default connect(mapStateToProps, { markNotificationsRead })(Notifications);