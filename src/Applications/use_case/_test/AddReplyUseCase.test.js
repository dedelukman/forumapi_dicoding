const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-232',
      content: 'reply content',
      owner: 'user-232',
    };

    const mockAddedReply = new AddedReply({
      id: 'lukman',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(
      new AddedReply({
        id: 'lukman',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new AddReply({
        commentId: useCasePayload.commentId,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );
  });
});
