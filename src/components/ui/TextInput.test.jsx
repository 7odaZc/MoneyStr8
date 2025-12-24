import React from "react";
import { render, screen } from "@testing-library/react";
import TextInput from "./TextInput";

test("renders label + error and sets aria attributes", () => {
  render(<TextInput label="Email" name="email" error="Bad email" value="" onChange={() => {}} />);

  const input = screen.getByLabelText("Email");
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("Bad email")).toBeInTheDocument();
});
