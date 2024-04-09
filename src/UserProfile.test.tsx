import { render, waitFor } from '@testing-library/react';
import UserProfile from './UserProfile';

describe('UserProfile', () => {
    it('fetches and displays user data', async () => {
        // Мокуємо відповідь від API
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: async () => ({ name: 'Leanne Graham', email: 'Sincere@april.biz' }),
        } as Response);

        // Рендеримо компонент
        const { getByText, getByTestId, queryByTestId } = render(<UserProfile />);

        // Очікуємо, що індикатор завантаження відображатиметься
        expect(getByTestId('loading-indicator')).toBeInTheDocument();

        // Очікуємо, що дані користувача будуть відображені
        await waitFor(() => {
            expect(getByText('Name: Leanne Graham')).toBeInTheDocument();
            expect(getByText('Email: Sincere@april.biz')).toBeInTheDocument();
        });

        // Очікуємо, що індикатор завантаження більше не відображається
        expect(queryByTestId('loading-indicator')).toBeNull();
    });

    it('displays error message on failed request', async () => {
        // Мокуємо відповідь від API, щоб симулювати помилку
        jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Failed to fetch user data'));

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
