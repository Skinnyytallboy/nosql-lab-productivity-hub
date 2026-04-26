const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/Task');

jest.mock('../src/config/database', () => ({
  connectDB: jest.fn(),
  disconnectDB: jest.fn(),
}));

jest.mock('../src/models/Task');

const FAKE_ID = '507f1f77bcf86cd799439011';

const makeSortMock = (result) => ({
  sort: jest.fn().mockResolvedValue(result),
});

describe('GET /api/health', () => {
  it('returns health check message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Tasks API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/tasks', () => {
    it('creates a new task', async () => {
      const task = { _id: FAKE_ID, title: 'Learn MongoDB', priority: 'high', completed: false };
      Task.create.mockResolvedValue(task);

      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Learn MongoDB', priority: 'high' });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Learn MongoDB');
      expect(res.body.data.priority).toBe('high');
      expect(res.body.data.completed).toBe(false);
    });

    it('returns 400 when title is missing', async () => {
      Task.create.mockRejectedValue(new Error('Title is required'));

      const res = await request(app).post('/api/tasks').send({ description: 'No title' });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks', () => {
    it('returns all tasks', async () => {
      const tasks = [
        { _id: FAKE_ID, title: 'Task 1' },
        { _id: FAKE_ID + '1', title: 'Task 2' },
      ];
      Task.find.mockReturnValue(makeSortMock(tasks));

      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
    });

    it('filters tasks by completed status', async () => {
      const tasks = [{ _id: FAKE_ID, title: 'Done Task', completed: true }];
      Task.find.mockReturnValue(makeSortMock(tasks));

      const res = await request(app).get('/api/tasks?completed=true');
      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(1);
      expect(Task.find).toHaveBeenCalledWith(expect.objectContaining({ completed: true }));
    });

    it('filters tasks by priority', async () => {
      const tasks = [{ _id: FAKE_ID, title: 'High Priority', priority: 'high' }];
      Task.find.mockReturnValue(makeSortMock(tasks));

      const res = await request(app).get('/api/tasks?priority=high');
      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(1);
      expect(Task.find).toHaveBeenCalledWith(expect.objectContaining({ priority: { $eq: 'high' } }));
    });

    it('returns 400 for an invalid priority value', async () => {
      const res = await request(app).get('/api/tasks?priority=urgent');
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('returns a task by id', async () => {
      const task = { _id: FAKE_ID, title: 'Find Me' };
      Task.findById.mockResolvedValue(task);

      const res = await request(app).get(`/api/tasks/${FAKE_ID}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.title).toBe('Find Me');
    });

    it('returns 404 for non-existent task', async () => {
      Task.findById.mockResolvedValue(null);

      const res = await request(app).get(`/api/tasks/${FAKE_ID}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('updates a task', async () => {
      const updated = { _id: FAKE_ID, title: 'New Title', completed: true };
      Task.findByIdAndUpdate.mockResolvedValue(updated);

      const res = await request(app)
        .put(`/api/tasks/${FAKE_ID}`)
        .send({ title: 'New Title', completed: true });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.title).toBe('New Title');
      expect(res.body.data.completed).toBe(true);
    });

    it('returns 404 for non-existent task', async () => {
      Task.findByIdAndUpdate.mockResolvedValue(null);

      const res = await request(app).put(`/api/tasks/${FAKE_ID}`).send({ title: 'x' });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('deletes a task', async () => {
      Task.findByIdAndDelete.mockResolvedValue({ _id: FAKE_ID, title: 'Delete Me' });

      const res = await request(app).delete(`/api/tasks/${FAKE_ID}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 404 for non-existent task', async () => {
      Task.findByIdAndDelete.mockResolvedValue(null);

      const res = await request(app).delete(`/api/tasks/${FAKE_ID}`);
      expect(res.statusCode).toBe(404);
    });
  });
});
