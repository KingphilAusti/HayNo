import { render, screen } from '@testing-library/react';
import App from '../../src/App';

describe('App', () => {
  it('renders the VectorStorageApp component', () => {
    render(<App />);
    const vectorStorageAppElement = screen.getByTestId('vector-storage-app');
    expect(vectorStorageAppElement).toBeInTheDocument();
  });

  it('renders the Chatbot component', () => {
    render(<App />);
    const chatbotElement = screen.getByTestId('chatbot');
    expect(chatbotElement).toBeInTheDocument();
  });
});