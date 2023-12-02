const pool = require('../../database/postgres/pool');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {});

    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
  });

  describe('behavior test', () => {
    beforeAll(async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'SomeUser',
      });
      await ThreadTableTestHelper.addThread({
        id: 'thread-232',
        owner: 'user-123',
      });
    });

    afterEach(async () => {
      await CommentTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await CommentTableTestHelper.cleanTable();
      await ThreadTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await pool.end();
    });

    describe('addComment function', () => {
      it('addComment function should add database entry for said comment', async () => {
        // arrange
        const addComment = new AddComment({
          content: 'some content',
          threadId: 'thread-232',
          owner: 'user-123',
        });
        const fakeIdGenerator = () => '232';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          fakeIdGenerator
        );

        // action
        const addedComment = await commentRepositoryPostgres.addComment(
          addComment
        );
        const comments = await CommentTableTestHelper.findCommentById(
          addedComment.id
        );

        // assert
        expect(addedComment).toStrictEqual(
          new AddedComment({
            id: 'comment-232',
            content: addComment.content,
            owner: addComment.owner,
          })
        );
        expect(comments).toHaveLength(1);
      });

      it('should return added comment correctly', async () => {
        // arrange
        const addComment = new AddComment({
          content: 'some content',
          threadId: 'thread-232',
          owner: 'user-123',
        });

        const fakeIdGenerator = () => '232';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          fakeIdGenerator
        );

        // action
        const addedComment = await commentRepositoryPostgres.addComment(
          addComment
        );

        // assert
        expect(addedComment).toStrictEqual(
          new AddedComment({
            id: 'comment-232',
            content: addComment.content,
            owner: addComment.owner,
          })
        );
      });
    });

    describe('verifyCommentOwner function', () => {
      it('should return true when comment owner is the same as the payload', async () => {
        const addComment = new AddComment({
          content: 'some content',
          threadId: 'thread-232',
          owner: 'user-123',
        });

        const fakeIdGenerator = () => '232';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          fakeIdGenerator
        );

        await commentRepositoryPostgres.addComment(addComment);

        const isCommentOwner =
          await commentRepositoryPostgres.verifyCommentOwner(
            'comment-232',
            'user-123'
          );

        expect(isCommentOwner).toBeTruthy();
      });

      it('should return Authorizationerror when comment owner is not the same as the payload', async () => {
        const addComment = new AddComment({
          content: 'some content',
          threadId: 'thread-232',
          owner: 'user-123',
        });

        const fakeIdGenerator = () => '232';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          fakeIdGenerator
        );

        await commentRepositoryPostgres.addComment(addComment);

        await expect(
          commentRepositoryPostgres.verifyCommentOwner(
            'comment-232',
            'user-432'
          )
        ).rejects.toThrowError(AuthorizationError);
      });
    });

    describe('getCommentByThreadId function', () => {
      it('should return all comments from a thread correctly', async () => {
        const firstComment = {
          id: 'comment-232',
          content: 'first comment',
          date: new Date('2023-06-24T00:00:00.000Z'),
        };
        const secondComment = {
          id: 'comment-345',
          content: 'second comment',
          date: new Date('2023-06-24T01:00:00.000Z'),
        };

        await CommentTableTestHelper.addComment(firstComment);
        await CommentTableTestHelper.addComment(secondComment);
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
          {}
        );

        let commentDetails =
          await commentRepositoryPostgres.getCommentsByThreadId('thread-232');

        commentDetails = commentDetails.map((comment) => ({
          id: comment.id,
          content: comment.content,
          date: comment.date,
          username: comment.username,
        }));

        expect(commentDetails).toEqual([
          { ...firstComment, username: 'SomeUser' },
          { ...secondComment, username: 'SomeUser' },
        ]);
      });

      it('should return an empty array when no comments exist for the thread', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
          {}
        );

        const commentDetails =
          await commentRepositoryPostgres.getCommentsByThreadId('thread-232');
        expect(commentDetails).toStrictEqual([]);
      });
    });

    describe('verifyAvailableCommentInThread function', () => {
      it('should throw NotFoundError when thread is not available', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
          {}
        );

        await expect(
          commentRepositoryPostgres.verifyAvailableCommentInThread(
            'thread-232',
            'comment-232'
          )
        ).rejects.toThrowError(NotFoundError);
      });

      it('should throw NotFoundError when comment is not available', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
          {}
        );

        await expect(
          commentRepositoryPostgres.verifyAvailableCommentInThread(
            'thread-232',
            'comment-232'
          )
        ).rejects.toThrowError(NotFoundError);
      });

      it('should not throw NotFoundError when thread and comment are available', async () => {
        await CommentTableTestHelper.addComment({
          id: 'comment-232',
          content: 'first comment',
          threadId: 'thread-232',
          date: new Date('2023-06-24T00:00:00.000Z'),
        });

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
          {}
        );

        await expect(
          commentRepositoryPostgres.verifyAvailableCommentInThread(
            'comment-232',
            'thread-232'
          )
        ).resolves.not.toThrowError(NotFoundError);
      });
    });

    describe('deleteCommentById function', () => {
      it('should throw NotFoundError when comment is not available', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
          {}
        );

        await expect(
          commentRepositoryPostgres.deleteCommentById('comment-123')
        ).rejects.toThrowError(NotFoundError);
      });

      it('should delete comment correctly', async () => {
        await CommentTableTestHelper.addComment({
          id: 'comment-232',
          content: 'first comment',
          threadId: 'thread-232',
          date: new Date('2023-06-24T00:00:00.000Z'),
        });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
          {}
        );

        await commentRepositoryPostgres.deleteCommentById('comment-232');

        const comment = await CommentTableTestHelper.findCommentById(
          'comment-232'
        );
        expect(comment[0].is_deleted).toEqual(true);
      });
    });
  });
});
