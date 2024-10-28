import { prisma } from '~/db/prisma'

export async function addComment(
  targetId: string,
  comment: string,
  accountId: string,
) {
  let commentData

  commentData = await prisma.comment.create({
    data: {
      content: comment,
      userId: accountId,
      reviewId: targetId,
    },
  })

  return commentData
}
