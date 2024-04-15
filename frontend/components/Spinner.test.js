// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
// import Spinner from "./Spinner"
import React from "react"
import {queryByTestId, render} from '@testing-library/react'
import Spinner from "./Spinner"
import '@testing-library/jest-dom';


test('Spinner renders correctly based on props', () => {
  // When spinner is visible
  const { getByTestId, rerender, queryByTestId } = render(<Spinner on={true} />);
  expect(getByTestId('spinner')).toBeInTheDocument();

  // When spinner is not visible
  rerender(<Spinner on={false} />);
  expect(queryByTestId('spinner')).not.toBeInTheDocument();
});
