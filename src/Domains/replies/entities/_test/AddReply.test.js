const AddReply = require('../AddReply');

describe('a AddReply entities', () => {
  it('should throw error when payload did not contain needed property ', () => {
    // Arrange
    const payload = { content: 'sebuah balasan yang tak terbalaskan' };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError(
      'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = { commentId: true, content: 232, owner: 'user-123' };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError(
      'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create AddReply object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-232',
      content: 'contoh balasan',
      owner: 'user-123',
    };

    // Action
    const { content } = new AddReply(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});
