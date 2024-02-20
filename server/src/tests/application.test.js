describe('Application tests', () => {
    describe('Feat1', () => {
        test('testGet', async () => {
            const response = await request(app)
                .get('/api/v1/ **');
            expect(response.statusCode).toBe(200);
            expect(respose.body).toBeDefined();
        });
        test('testPost', async () => {
            const response = await request(app)
                .post('/api/v1/ **')
                .send({
                        // Request Body
                    }
                )
            expect(response.statusCode).toBe(200);
            expect(respose.body).toBeDefined();

        });
    });
});