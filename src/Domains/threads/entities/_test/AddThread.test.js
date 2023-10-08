const AddThread = require('../AddThread');

describe('a AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'lukman',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 6789,
      body: true,
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should throw error when title contain more 100 character', () => {
    // Arrange
    const payload = {
      title:
        'dedelukmanulhakimdedelukmanulhakimdedelukmanulhakimdedelukmanulhakimdedelukmanulhakimdedelukmanulhakimdedelukmanulhakimdedelukmanulhakimdedelukmanulhakimdedelukmanulhakimdedelukmanulhakim',
      body: 'lukman',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.TITLE_LIMIT_CHAR'
    );
  });

  it('should create addThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'lukman',
      body: 'dede lukmanul hakim',
    };

    // Action
    const { title, body } = new AddThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
