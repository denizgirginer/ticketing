export const stripe = {
    charges: {
        create: jest.fn().mockResolvedValue({
            source: 'source',
            amount: 10*100,
            currency: 'currency'
        })
    }
}