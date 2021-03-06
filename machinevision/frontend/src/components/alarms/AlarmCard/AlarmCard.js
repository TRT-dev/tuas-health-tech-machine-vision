import React from 'react';
import { useMutation } from 'react-query';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import CircularProgress from '@material-ui/core/CircularProgress';

import { acknowledgeAlarm } from '../../../utils/alarms';
import { formatTime } from '../../../utils/time';

const useStyles = makeStyles((theme) => ({
  iconAndText: {
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  item: {
    display: 'inline-block',
  },
  bold: {
    fontWeight: 'bold',
  },
  divider: {
    marginTop: 5,
    marginBottom: 5,
  },
  acknowledgedTrue: {
    color: 'green',
  },
  acknowledgedFalse: {
    color: 'red',
  },
  acknowledgeText: {
    color: 'gray',
    fontSize: 15,
  },
  center: {
    justifyContent: 'center',
  },
}));

const AlarmCard = ({ alarm, authToken }) => {
  const classes = useStyles();
  const [
    updateAlarm,
    { isLoading, isError, isSuccess, data: updatedAlarm, error },
  ] = useMutation(() => {
    return acknowledgeAlarm(alarm.id, authToken);
  });

  let ListItemContent = ({ itemData }) => {
    const alarmTime = formatTime(itemData.created_at);

    return (
      <ListItem
        button
        className={classes.item}
        onClick={() => updateAlarm()}
        disabled={itemData.acknowledged}
      >
        <Container>
          <ListItemIcon
            className={classes.iconAndText}
            style={
              !itemData.acknowledged ? { color: 'red' } : { color: 'green' }
            }
          >
            <WarningIcon className={classes.icon} />
            <ListItemText primary='Alarm' />
          </ListItemIcon>
          {!itemData.acknowledged && (
            <ListItemText
              primary='Click to Acknowledge'
              classes={{ primary: classes.acknowledgeText }}
            />
          )}
        </Container>
        <Container>
          <Typography>
            <span className={classes.bold}>Time: </span>
            {alarmTime}
          </Typography>
          <Typography>
            <span className={classes.bold}>Acknowledged: </span>
            <span
              className={
                itemData.acknowledged
                  ? classes.acknowledgedTrue
                  : classes.acknowledgedFalse
              }
            >
              {itemData.acknowledged ? 'True' : 'False'}
            </span>
          </Typography>
          <Divider className={classes.divider} />
          <Typography>{itemData.message}</Typography>
        </Container>
      </ListItem>
    );
  };

  let CardContent = () => {
    if (isLoading) {
      return (
        <ListItem className={classes.center} disabled={true}>
          <CircularProgress />
        </ListItem>
      );
    }

    // when updating alarm status is successful
    // pass updated data to ListItemContent
    if (isSuccess && updatedAlarm) {
      return <ListItemContent itemData={updatedAlarm.data} />;
    }

    if (isError && error) {
      let errorMsg = `${error.message}`;

      return (
        <ListItem className={classes.center} disabled={true}>
          <p>Error updating alarm status: {errorMsg}</p>
        </ListItem>
      );
    }

    return <ListItemContent itemData={alarm} />;
  };

  return <CardContent />;
};

export default AlarmCard;
