export function getAppointmentsForDay(state, day) {
  if (state.days.length === 0) return []
  const filteredDays = state.days.filter((dayObject => dayObject.name === day));
  if (filteredDays.length === 0) return []
  const filteredDaysAppointmentsId = filteredDays[0].appointments;
  const appointmentsArray = Object.values(state.appointments);
  const result = appointmentsArray.filter(appointment => filteredDaysAppointmentsId.includes(appointment.id))
  return result;
}

export function getInterviewersForDay(state, day) {
  if (state.days.length === 0) return []
  const filteredDays = state.days.filter((dayObject => dayObject.name === day));
  if (filteredDays.length === 0) return []
  const filteredDaysInterviewersId = filteredDays[0].interviewers;
  const interviewersArray = Object.values(state.interviewers);
  const result = interviewersArray.filter(interviewer => filteredDaysInterviewersId.includes(interviewer.id))
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

export function findDayId(aptId, days) {
  for (let day of days) {
    if (day.appointments.includes(aptId)) {
      return day.id
    }
  }
}
