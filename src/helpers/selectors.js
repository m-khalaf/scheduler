export function getAppointmentsForDay(state, day) {
  if (state.days.length === 0) return []
  const filteredDays = state.days.filter((dayObject => dayObject.name === day));
  if (filteredDays.length === 0) return []
  const filteredDaysAppointmentsId = filteredDays[0].appointments;
  const appointmentsArray = Object.values(state.appointments);
  const result = appointmentsArray.filter(appointment => filteredDaysAppointmentsId.includes(appointment.id))
  return result;

}


export function getInterview(state, interview) {
  if (!interview) return null;
  const result = { ...interview };
  const interviewers = Object.values(state.interviewers);
  const interviewer = interviewers.filter(interviewer => interviewer.id === interview.interviewer)
  result.interviewer = interviewer[0];
  return result;

}

