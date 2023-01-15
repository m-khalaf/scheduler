import { useState, useEffect } from "react";
import axios from "axios";
import {findDayId} from "helpers/selectors";

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });


  const setDay = day => setState(prev => ({ ...prev, day }));

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }))
    });
  }, [])



  const bookInterview = function (id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const updateSpotsRemaining = function(aptId){
      const dayID = findDayId(aptId, state.days) - 1; //grab the day id
      const day = {     //clone the updated day and change the spots
        ...state.days[dayID],
        spots: state.days[dayID].spots-1
      }
  
      const days = [...state.days] ;   //clone days array and update the changed day
      days[dayID] = day;

      return days
    }

    const days = updateSpotsRemaining(id)
    

  

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => {
        setState({
          ...state,
          appointments,
          days

        })
      })
  };

  const cancelInterview = function (id) {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const updateSpotsRemaining = function(aptId){
      const dayID = findDayId(aptId, state.days) - 1; //grab the day id
      const day = {     //clone the updated day and change the spots
        ...state.days[dayID],
        spots: state.days[dayID].spots+1
      }
  
      const days = [...state.days] ;   //clone days array and update the changed day
      days[dayID] = day;

      return days
    }
    const days = updateSpotsRemaining(id)

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState({
          ...state,
          appointments,
          days
        })
      })
  };


  return { state, setDay, bookInterview, cancelInterview }
}



