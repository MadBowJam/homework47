import { render, waitFor } from '@testing-library/react';
import UserProfile from './UserProfile';

describe('UserProfile', () => {
    let originalFetch: typeof global.fetch;

    beforeEach(() => {
        originalFetch = global.fetch;
        jest.spyOn(global, 'fetch');
    });

    afterEach(() => {
        jest.restoreAllMocks();
        global.fetch = originalFetch;
    });

    it('fetches and displays user data', async () => {
        // Мокуємо відповідь від API
        (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ name: 'John', email: 'john@example.com' }),
        } as Response);

        // Рендеримо компонент
        const { getByText, getByTestId, queryByTestId } = render(<UserProfile />);

        // Очікуємо, що індикатор завантаження відображатиметься
        expect(getByTestId('loading-indicator')).toBeInTheDocument();

        // Очікуємо, що дані користувача будуть відображені
        await waitFor(() => {
            expect(getByText(/Name: [A-Za-z]{3,}/)).toBeInTheDocument(); // Перевірка імені мінімум з 3 букв
            expect(getByText(/Email: [A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)).toBeInTheDocument(); // Перевірка електронної адреси
        });

        // Очікуємо, що індикатор завантаження більше не відображається
        expect(queryByTestId('loading-indicator')).toBeNull();
    });

    it('displays error message on failed request', async () => {
        // Мокуємо відповідь від API, щоб симулювати помилку
        (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error('Failed to fetch user data'));

        // Рендеримо компонент
        const { getByText, getByTestId, queryByTestId } = render(<UserProfile />);

        // Очікуємо, що індикатор завантаження відображатиметься
        expect(getByTestId('loading-indicator')).toBeInTheDocument();

        // Очікуємо, що повідомлення про помилку буде відображено
        await waitFor(() => {
            expect(getByText('Error: Failed to fetch user data')).toBeInTheDocument();
        });

        // Очікуємо, що індикатор завантаження більше не відображається
        expect(queryByTestId('loading-indicator')).toBeNull();
    });
});
