import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import GitSearch3 from './SearchGit3';

test('renders Git link', () => {
  render(<GitSearch3 />);
  const linkElement = screen.getByText(/GitSearch 3/i);
  expect(linkElement).toBeInTheDocument();
});

test('No error at start', () => {
  const content = render(<GitSearch3/>)
  expect(content.queryByTestId('error')).not.toBeTruthy()
})

test('Check button state', () => {
  const content = render(<GitSearch3/>)
  expect(content.getByText('Search').closest('button').disabled).toBeTruthy()
})

test('Disable table on start', () => {
  const content = render(<GitSearch3/>)
  expect(content.queryByTestId('gitDataTable')).not.toBeTruthy()
})

