import request from 'supertest';
import { app } from '../../index'; 


describe('POST /invitations', () => {
  it('debería generar una invitación y retornar 201', async () => {
    const res = await request(app)
      .post('/invitations')
      .send({
      email_invitado:"nuevo@test.com",
      role_asignado:"admin"
  })
     
      .set('Authorization', 'Bearer token-de-prueba');

    expect(res.statusCode).toBe(201);
    expect(res.body.invitation).toHaveProperty('token');
    expect(res.body.invitation).toHaveProperty('expires_at');
  });

  it('no debería permitir invitar si el email ya tiene una invitación pendiente', async () => {
  });
});