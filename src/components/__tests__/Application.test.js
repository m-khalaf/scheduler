import React from "react";
import axios from "axios";


import { render, cleanup, waitForElement, fireEvent, prettyDOM, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);
describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("changes the schedule when a new day is selected using async", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    //debug(appointment);

    const days = getAllByTestId(container, "day");
    const day = days.find(day => queryByText(day, "Monday"))
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
    //debug(day);

    //console.log(prettyDOM(appointment));
    //console.log(prettyDOM(container));

    // 1. Render the Application.
    // 2. Wait until the text "Archie Cohen" is displayed.
    // 3. Click the "Add" button on the first empty appointment.
    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    // 5. Click the first interviewer in the list.
    // 6. Click the "Save" button on that same appointment.
    // 7. Check that the element with the text "Saving" is displayed.
    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "DELETING")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const days = getAllByTestId(container, "day");
    const day = days.find(day => queryByText(day, "Monday"))
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
    //debug();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Check that the edit form is shown.
    expect(getByText(appointment, "Tori Malcolm")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByText(appointment, "Archie Cohen"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const days = getAllByTestId(container, "day");
    const day = days.find(day => queryByText(day, "Monday"))
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
    
    //debug();

  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "could not save apointment"));

    //debug();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "DELETING")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "could not delete apointment"));

    //debug();
  });


});
