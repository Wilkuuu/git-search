import { render, screen } from '@testing-library/react';
import App from './App';
import GitSearch3 from './SearchGit3';

test('renders Git link', () => {
  render(<GitSearch3 />);
  const linkElement = screen.getByText(/GitSearch 3/i);
  expect(linkElement).toBeInTheDocument();
});

test('Empty list', () => {
  render(<GitSearch3 />);

});