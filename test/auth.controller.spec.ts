import request from 'supertest';
import { app } from '../src/app';
import { LoginDto } from '../src/dto';
import { authService } from '../src/services';

describe('authController', () => {
  it('should return access token', async () => {
    const response = {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    };
    jest.spyOn(authService, 'login').mockResolvedValue(response);
    const { data } = JSON.parse(
      (
        await request(app)
          .post('/api/auth/login')
          .send({ username: 'superadmin', password: '123456' } as LoginDto)
      ).text,
    );
    expect(data).toEqual(response);
  });
});
