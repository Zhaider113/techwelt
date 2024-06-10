import { getResponse, signInUser } from "../../services/axios";
import { GET_DEVICES, DEVICES_ERROR, GET_ALERTS, ALERTS_ERROR, GET_RULES, RULES_ERROR, GET_COMPANY, COMPANY_ERROR,  GET_USERTOKEN, GET_TOKENERROR, LOG_OUT, GET_TICKET, TICKET_ERROR, GET_ZONE, ZONE_ERROR } from "../store/types";

export const getDevices = (props) => async (dispatch) => {
  try {
    var response = await getResponse('/api/vehicles/show', 'post', props);
    if (response.status === 401) {
      dispatch({
        type: LOG_OUT
      })
    }
    if (response.status === 200) {
      dispatch({
        type: GET_DEVICES,
        payload: response.data,
      });
    }
  } catch (error) {
    dispatch({
      type: DEVICES_ERROR,
      payload: error,
    });
  }
};

export const getAlerts = (props) => async (dispatch) => {
  try {
    var response = await getResponse('/api/alerts/list', 'post', props);
    console.log(response,'response')
    if (response.status === 401) {
      dispatch({
        type: LOG_OUT
      })
    }
    if (response.status === 200) {
      dispatch({
        type: GET_ALERTS,
        payload: response.data,
      });
    }
  } catch (error) {
    dispatch({
      type: ALERTS_ERROR,
      payload: error,
    });
  }
};

export const getRules = (props) => async (dispatch) => {
  try {
    var response = await getResponse('/api/rules/ruleList', 'post', props);
    console.log(response,'response')
    if (response.status === 401) {
      dispatch({
        type: LOG_OUT
      })
    }
    if (response.status === 200) {
      dispatch({
        type: GET_RULES,
        payload: response.data,
      });
    }
  } catch (error) {
    dispatch({
      type: RULES_ERROR,
      payload: error,
    });
  }
};

export const getCompany = (props) => async (dispatch) => {
  try {
    var response = await getResponse('/api/company/companyList', 'post', props);
    console.log(response,'response')
    if (response.status === 401) {
      dispatch({
        type: LOG_OUT
      })
    }
    if (response.status === 200) {
      dispatch({
        type: GET_COMPANY,
        payload: response.data,
      });
    }
  } catch (error) {
    dispatch({
      type: COMPANY_ERROR,
      payload: error,
    });
  }
};

export const getTicket = (props) => async (dispatch) => {
  try {
    var response = await getResponse('/api/ticket/ticketList', 'post', props);
    console.log(response,'response')
    if (response.status === 401) {
      dispatch({
        type: LOG_OUT
      })
    }
    if (response.status === 200) {
      dispatch({
        type: GET_TICKET,
        payload: response.data,
      });
    }
  } catch (error) {
    dispatch({
      type: TICKET_ERROR,
      payload: error,
    });
  }
};

export const getZone = (props) => async (dispatch) => {
  try {
    var response = await getResponse('/api/zone/zoneList', 'post', props);
    console.log(response,'response')
    if (response.status === 401) {
      dispatch({
        type: LOG_OUT
      })
    }
    if (response.status === 200) {
      dispatch({
        type: GET_ZONE,
        payload: response.data,
      });
    }
  } catch (error) {
    dispatch({
      type: ZONE_ERROR,
      payload: error,
    });
  }
};

export const getToken = (props) => async (dispatch) => {
  try {
    dispatch({
      type: GET_USERTOKEN,
      payload: await signInUser(props),
    });
  } catch (error) {
    dispatch({
      type: GET_TOKENERROR,
      payload: error,
    });
  }
};
