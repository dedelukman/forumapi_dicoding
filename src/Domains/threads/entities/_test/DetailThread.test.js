const DetailThread = require('../DetailThread');

describe('a DetailThread entites', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'lukman',
      body: 'lukman',
      date: 'lukman',
      username: 'lukman',
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 576576,
      title: 'lukman',
      body: 'lukman',
      date: true,
      username: 'lukmnan',
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create DetailThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'lukman',
      title: 'lukman',
      body: 'lukman',
      date: 'lukman',
      username: 'lukmnan',
    };

    // Action
    const { id, title, body, date, username } = new DetailThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
